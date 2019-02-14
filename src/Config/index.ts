import * as fs from 'fs'
import { resolve } from 'path'
import * as dotEnv from 'dotenv'

import { argv } from '@/App'
import { Console } from '@/Tools'

const configLog = Console('[Config]')
const getEnvPath = (env: string) => `src/Config/${env}.env`
const ConfigFile = 'src/Config/Config.json'

export const Config = {
  initialise() {
    Config.createConfigIfNotExists()
    Config.setProcessEnviroment()
  },

  createConfigIfNotExists() {
    const isExists = fs.existsSync(resolve(ConfigFile))

    if (!isExists) {
      const defaultOptions = {
        token: 'your token'
      }

      fs.writeFileSync(
        resolve(ConfigFile),
        JSON.stringify(defaultOptions, null, 2),
        {
          encoding: 'utf-8'
        }
      )

      configLog.log(
        'Configuration file not found. ' +
          "'Config.json' files is created at src/Config. " +
          'Modify that to yours and then restart me'
      )
    }
  },

  setProcessEnviroment() {
    if (!process.env.NODE_ENV) {
      if (!argv.has('env')) {
        Config.setFullEnviroment('development')

        // prettier-ignore
        configLog.warn('NODE_ENV could not found at enviroment path or cli arguments!')
        configLog.warn("Automatically NODE_ENV set to 'development'")
      } else {
        const env = argv.get('env')

        if (env !== ('development' || 'production')) {
          configLog.warn(
            'Unknown NODE_ENV detected at cli arguments. ' +
              'This can cause unexpected problems in the future'
          )
        }

        Config.setFullEnviroment(env)
      }
    } else {
      Config.setFullEnviroment(process.env.NODE_ENV)
    }
  },

  setFullEnviroment(envPath: string) {
    process.env = dotEnv.config({ path: resolve(getEnvPath(envPath)) }).parsed
    process.env.NODE_ENV = envPath
  }
}
