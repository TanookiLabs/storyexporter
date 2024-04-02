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
      console.log('run configure')
      return
    }

    let currentDirectory = process.cwd()

    let dbPath = flags.database

    // if the db exists already, don't open it, use fs promise api
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

    migrate(db, {migrationsFolder: 'drizzle'}) // can this be done without migration files? need to make sure this works when run from a different directory

    const api = trackerApi(config)
    // steps:
    // - projects
    // - epics
    // - stories

    await api.page<Array<tracker.Epic>>(
      `https://www.pivotaltracker.com/services/v5/projects/${projectId}/epics`,
      (page) => {
        return db.insert(tracker.epicTable).values(page)
      },
    )

    await api.page<Array<tracker.Project>>(
      `https://www.pivotaltracker.com/services/v5/projects/${projectId}`,
      (page) => {
        return db.insert(tracker.projectTable).values(page)
      },
    )

    await api.paginate<Array<tracker.Story>>(
      `https://www.pivotaltracker.com/services/v5/projects/${projectId}/stories`,
      async (page) => {
        db.insert(tracker.storyTable).values(page)
        console.log(`adding ${page.length} stories`)

        for (const story of page) {
          api.page<Array<tracker.Comment>>(
            `https://www.pivotaltracker.com/services/v5/projects/${projectId}/stories/${story.id}/comments`,
            async (page) => {
              db.insert(tracker.commentTable).values(page)
            },
          )
        }
      },
    )

    // returns counts of tables
    console.log('epics: ' + (await db.select({count: count()}).from(tracker.epicTable))[0].count)
    console.log('stories: ' + (await db.select({count: count()}).from(tracker.storyTable))[0].count)
    console.log('comments: ' + (await db.select({count: count()}).from(tracker.commentTable))[0].count)
  }
}
