import * as Cluster from 'cluster'
// import { cpus } from 'os'
import { join } from 'path'
import { Console } from '@/Tools'

const getPureArguments = () => {
  const PureArguments = new Map<string, any>()

  // Remove two factors from argv that never need
  process.argv.splice(0, 2)
  process.argv
    .filter(arg => arg.match(/^-(?!-)/))
    .map(arg => {
      process.argv.splice(process.argv.indexOf(arg, 1), 1)

      PureArguments.set(arg.slice(1), true)
    })
  process.argv
    .filter(arg => arg.includes('--'))
    .map((_, i) =>
      PureArguments.set(process.argv[i * 2].slice(2), process.argv[++i * 2 - 1])
    )

  return PureArguments
}

// const MAX_WORKERS = cpus().length
const argv = getPureArguments()
const coreLog = Console('[Core]')

const execArgv = ['-r', 'tsconfig-paths/register', '-r', 'ts-node/register']
const exec = join(`${__dirname}/Shard.ts`)
Cluster.setupMaster({ execArgv, exec })

export const App = {
  start() {
    coreLog.log('test')
    coreLog.log(argv)
    coreLog.log()
  }
}
