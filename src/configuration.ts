import {z} from 'zod'
import {Command} from '@oclif/core'
import path from 'node:path'

export const configSchema = z.object({
  apiKey: z.string(),
})

export type Config = z.infer<typeof configSchema>

export function configPath(ctx: Command) {
  return path.join(ctx.config.configDir, 'config.json')
}
