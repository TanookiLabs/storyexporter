import {Command, Flags} from '@oclif/core'
import Database from 'better-sqlite3'
import {drizzle} from 'drizzle-orm/better-sqlite3'
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core'
import {promises as fs} from 'node:fs'
import {configPath, configSchema} from '../configuration.js'
import {sql} from 'drizzle-orm'
import {migrate} from 'drizzle-orm/better-sqlite3/migrator'

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
    const output = flags.output

    let config
    try {
      const configFile = await fs.readFile(configPath(this))
      config = configSchema.parse(JSON.parse(configFile.toString()))
    } catch (er) {
      console.error('error reading config file', er)
      console.log('run configure')
      return
    }

    const sqlite = new Database(output)
    const db = drizzle(sqlite)

    migrate(db, {migrationsFolder: 'drizzle'}) // can this be done without migration files? need to make sure this works when run from a different directory

    // steps:
    // - projects
    // - epics
    // - stories
    const resp = await fetch(`https://www.pivotaltracker.com/services/v5/projects/${projectId}/epics`, {
      headers: {
        'X-TrackerToken': config.apiKey,
        accept: 'application/json',
      },
    })

    console.log(await resp.json())
    console.log('x')
  }
}
