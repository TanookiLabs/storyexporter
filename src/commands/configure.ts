import {Args, Command, Flags} from '@oclif/core'
import {Config, configSchema} from '../configuration.js'
import {promises as fs} from 'node:fs'
import path from 'node:path'

export default class Configure extends Command {
  static description = 'describe the command here'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    apiKey: Flags.string({description: 'API key', required: true}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Configure)
    const apiKey = flags.apiKey
    const data: Config = {apiKey}

    if (!await fs.stat(this.config.configDir).catch(() => false)) {
      await fs.mkdir(this.config.configDir, {recursive: true})
    }

    const configPath = path.join(this.config.configDir, 'config.json')
    await fs.writeFile(configPath, JSON.stringify(data, null, 2))

    console.log('Configuration saved to ' + configPath)
  }
}
