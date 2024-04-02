import {Command, Flags} from '@oclif/core'
import {promises as fs} from 'node:fs'
import path from 'node:path'
import {configPath, configSchema} from '../configuration.js'

export default class Dump extends Command {
  static description = 'describe the command here'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    output: Flags.string({char: 'o', description: 'path to sqlite database file', required: true}),
    project: Flags.string({char: 'p', description: 'project id to dump', required: true}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Dump)
    const projectId = flags.project
    const db = flags.db

    const configFile = await fs.readFile(configPath(this))
    const config = configSchema.parse(JSON.parse(configFile.toString()))

    this.log('User config:')
    console.dir(config)
  }
}
