import {Command, Flags} from '@oclif/core'
import Database from 'better-sqlite3'
import {drizzle} from 'drizzle-orm/better-sqlite3'
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core'
import {promises as fs} from 'node:fs'
import {configPath, configSchema} from '../configuration.js'
import { sql } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { users } from '../schema.js'

export default class Dump extends Command {
  static description = 'describe the command here'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    database: Flags.string({char: 'o', description: 'path to sqlite database file, e.g. output.db', required: true}),
    project: Flags.string({char: 'p', description: 'project id to dump', required: true}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Dump)
    const projectId = flags.project
    const output = flags.output

    const configFile = await fs.readFile(configPath(this))
    const config = configSchema.parse(JSON.parse(configFile.toString()))

    const sqlite = new Database(output)
    const db = drizzle(sqlite)

    migrate(db, {migrationsFolder: 'drizzle'}) // can this be done without migration files?
    console.log('done migration')

    await db.insert(users).values({
      id: '1',
      textModifiers: 'hello',
      // intModifiers: 1,
    })

    const result = await db.select().from(users)
    console.log('result', result)

    this.log('User config:')
    console.dir(config)
  }
}
