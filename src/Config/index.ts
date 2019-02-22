import * as fs from 'fs'
import { join } from 'path'
import * as dotEnv from 'dotenv'

import { argv } from '@/App'
import { Console } from '@/Tools'

const envPath = join(`${__dirname}/.env`)
const configLog = Console('[Config]')

export const Config = {
  initialise() {
    if (!process.env.NODE_ENV) {
      if (!argv.has('env')) {
        configLog.warn(
          "Could not found 'NODE_ENV' in environment variable or cli argument"
        )
      } else {
        const env = argv.get('env')

        if (env !== ('development' || 'production' || 'test' || 'debug')) {
          configLog.warn(
            'Unkown Node_ENV detected in cli argument.',
            'This can cause unexpected problems in the future'
          )
        }
      }
    }

    if (fs.existsSync(envPath)) {
      const parsedEnv = dotEnv.config({
        path: envPath
      })

      if (parsedEnv.error) {
        throw new Error('Failed to parse env file')
      }

      process.env = parsedEnv.parsed
      process.env.NODE_ENV =
        process.env.NODE_ENV ||
        (argv.has('env') ? argv.get('env') : 'development')
    } else {
      configLog.error('Could not found env file')
      throw new Error('Could not found env file')
    }
  }
}
