import {Command, Flags} from '@oclif/core'
import Database from 'better-sqlite3'
import {drizzle} from 'drizzle-orm/better-sqlite3'
import {migrate} from 'drizzle-orm/better-sqlite3/migrator'
import {promises as fs} from 'node:fs'
import {configPath, configSchema} from '../configuration.js'
import * as tracker from '../schema.js'
import {trackerApi} from '../tracker.js'
import {count} from 'drizzle-orm'

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

    let config
    try {
      const configFile = await fs.readFile(configPath(this))
      config = configSchema.parse(JSON.parse(configFile.toString()))
    } catch (er) {
      console.error('error reading config file', er)
      console.error('to fix this: run `storyexporter configure --apiKey <your api key>`')
      return
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
    migrate(db, {migrationsFolder: 'drizzle'})

    const api = trackerApi(config)

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
      }
    )

    await api.page<Array<tracker.Epic>>(
      `https://www.pivotaltracker.com/services/v5/projects/${projectId}/epics`,
      (page) => {
        return db.insert(tracker.epicTable).values(page)
      },
    )

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
      await db.insert(tracker.personTable).values(people)
    })

    await api.paginate<Array<tracker.Story>>(
      `https://www.pivotaltracker.com/services/v5/projects/${projectId}/stories`,
      async (page) => {
        let result = await db.insert(tracker.storyTable).values(page)
        console.log(`added ${result.changes} stories`)
        console.log(JSON.stringify(page))

        for (const story of page) {
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
  }
}
