import {Command, Flags} from '@oclif/core'
import Database from 'better-sqlite3'
import {drizzle} from 'drizzle-orm/better-sqlite3'
import {migrate} from 'drizzle-orm/better-sqlite3/migrator'
import {promises as fs} from 'node:fs'
import {configPath, configSchema} from '../configuration.js'
import * as tracker from '../schema.js'
import {trackerApi} from '../tracker.js'
import {count, inArray} from 'drizzle-orm'
import {dirname} from 'path'
import {fileURLToPath} from 'url'

export default class Dump extends Command {
  static description = 'exports pivotal tracker data to sqlite database'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    database: Flags.string({char: 'o', description: 'path to sqlite database file, e.g. output.db', required: true}),
    project: Flags.string({char: 'p', description: 'project id to dump', required: true}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Dump)
    const projectId = flags.project

    let apiKey = process.env.PIVOTAL_TRACKER_API_KEY

    if (!apiKey) {
      try {
        const configFile = await fs.readFile(configPath(this))
        apiKey = configSchema.parse(JSON.parse(configFile.toString())).apiKey
      } catch (er) {
        console.error('error reading config file', er)
        console.error('to fix this: run `storyexporter configure --apiKey <your api key>`')
        return
      }
    }

    let dbPath = flags.database

    if (
      await fs
        .access(dbPath)
        .then(() => true)
        .catch(() => false)
    ) {
      console.error('database already exists')
      return
    }

    const sqlite = new Database(dbPath, {})
    const db = drizzle(sqlite)

    // TODO: do this without migration files if possible, not sure if drizzle supports that
    // need to make sure this works when run from a different directory
    const __dirname = dirname(fileURLToPath(import.meta.url))
    migrate(db, {migrationsFolder: `${__dirname}/../drizzle`})

    const api = trackerApi({apiKey})

    await api.page<Array<tracker.Project>>(
      `https://www.pivotaltracker.com/services/v5/projects/${projectId}`,
      (page) => {
        return db.insert(tracker.projectTable).values(page)
      },
    )

    await api.page<Array<tracker.Label>>(
      `https://www.pivotaltracker.com/services/v5/projects/${projectId}/labels`,
      (page) => {
        return db.insert(tracker.labelTable).values(page)
      },
    )

    await api.page<
      Array<{
        id: number
        kind: string
        created_at: string
        updated_at: string
        project_id: number
        name: string
        url?: string
        label: {
          id: number
        }
      }>
    >(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/epics`, (page) => {
      return db.insert(tracker.epicTable).values(page.map((epic) => ({...epic, label_id: epic.label?.id})))
    })

    await api.page<
      Array<{
        kind: string
        project_id: number
        id: number
        last_viewed_at: Date
        created_at: Date
        updated_at: Date
        role: string
        project_color: string
        favorite: boolean
        wants_comment_notification_emails: boolean
        will_receive_mention_notifications_or_emails: boolean
        person: {
          kind: string
          id: number
          name: string
          email: string
          initials: string
          username: string
        }
      }>
    >(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/memberships`, async (page) => {
      let people: Array<tracker.Person> = page.map((membership) => membership.person)
      if (people.length > 0) {
        await db.insert(tracker.personTable).values(people)
      }
    })

    type ApiStory = {
      kind: string
      id: number
      created_at: string
      updated_at: string
      accepted_at: string
      estimate?: number
      story_type: string
      story_priority: string
      name: string
      description?: string
      current_state: string
      requested_by_id: number
      url: string
      project_id: number
      owner_ids: number[]
      labels: ApiLabel[]
      blockers: ApiBlocker[]
      owned_by_id?: number
    }

    type ApiBlocker = {
      id: number
      kind: string
      description: string
      resolved: boolean
      story_id: number
      person_id: number
      created_at: string
      updated_at: string
    }

    type ApiLabel = {
      id: number
      project_id: number
      kind: string
      name: string
      created_at: string
      updated_at: string
    }

    await api.paginate<Array<ApiStory>>(
      `https://www.pivotaltracker.com/services/v5/projects/${projectId}/stories?fields=id,created_at,updated_at,accepted_at,estimate,story_type,story_priority,name,description,current_state,requested_by_id,url,project_id,owner_ids,labels,owned_by_id,blockers`,
      async (page) => {
        let peopleIds: Array<number> = Array.from(
          new Set(
            page.flatMap(
              (story) =>
                [story.requested_by_id, ...story.owner_ids, story.owned_by_id].filter(Boolean) as Array<number>,
            ),
          ),
        )

        await generateUnknownPeople(peopleIds)

        let storyResult = await db.insert(tracker.storyTable).values(page)
        console.log(`added ${storyResult.changes} stories`)

        const blockers = page.flatMap((story) => {
          return story.blockers.map((blocker) => ({...blocker, story_id: story.id}))
        })

        if (blockers.length > 0) {
          await db.insert(tracker.blockerTable).values(blockers)
        }

        for (const story of page) {
          // labels
          if (story.labels.length > 0) {
            await db.insert(tracker.storyLabelTable).values(
              story.labels.map((label) => ({
                label_id: label.id,
                story_id: story.id,
              })),
            )
          }

          // comments
          type ApiComment = {
            id: number
            story_id: number
            text: string
            person_id: number
            created_at: string
            updated_at: string
            file_attachments: ApiFileAttachment[]
          }

          type ApiFileAttachment = {
            kind: string
            id: number
            filename: string
            created_at: string
            uploader_id: number
            thumbnailable: boolean
            height: number
            width: number
            size: number
            download_url: string
            content_type: string
            uploaded: boolean
            big_url: string
            thumbnail_url: string
          }

          await api.page<Array<ApiComment>>(
            `https://www.pivotaltracker.com/services/v5/projects/${projectId}/stories/${story.id}/comments?fields=id,story_id,text,person_id,created_at,updated_at,file_attachments`,
            async (page) => {
              console.log(`adding ${page.length} comments to story ${story.id}...`)
              let peopleIds: Array<number> = Array.from(new Set(page.map((comment) => comment.person_id)))
              await generateUnknownPeople(peopleIds)

              await db.insert(tracker.commentTable).values(page)

              for (const comment of page) {
                for (const fileAttachment of comment.file_attachments) {
                  await db.insert(tracker.fileAttachmentTable).values({
                    ...fileAttachment,
                    comment_id: comment.id,
                  })

                  let downloadUrl = `https://www.pivotaltracker.com/file_attachments/${fileAttachment.id}/download`
                  const response = await api.rawRequest(downloadUrl)
                  const arrayBuffer = await response.arrayBuffer()
                  await db.insert(tracker.fileAttachmentFileTable).values({
                    file_attachment_id: fileAttachment.id,
                    blob: Buffer.from(arrayBuffer),
                  })
                }
              }
            },
          )
        }
      },
    )

    // returns counts of tables
    console.log('epics: ' + (await db.select({count: count()}).from(tracker.epicTable))[0].count)
    console.log('stories: ' + (await db.select({count: count()}).from(tracker.storyTable))[0].count)
    console.log('comments: ' + (await db.select({count: count()}).from(tracker.commentTable))[0].count)
    console.log('people: ' + (await db.select({count: count()}).from(tracker.personTable))[0].count)
    console.log('attachments: ' + (await db.select({count: count()}).from(tracker.fileAttachmentFileTable))[0].count)

    async function generateUnknownPeople(peopleIds: number[]) {
      let knownPeople = await db.select().from(tracker.personTable).where(inArray(tracker.personTable.id, peopleIds))
      let unknownPeople = peopleIds.filter((id) => !knownPeople.some((person) => person.id === id))
      if (unknownPeople.length > 0) {
        await db.insert(tracker.personTable).values(
          unknownPeople.map((id) => ({
            id,
            name: 'unknown',
            email: `unknown-${id}@example.com`,
            initials: '??',
            username: `unknown-${id}`,
          })),
        )
      }
    }
  }
}
