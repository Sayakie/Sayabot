import * as Cluster from 'cluster'
import { cpus } from 'os'
import { join } from 'path'

import * as pkg from 'package.json'
import env, { IPCEvents } from '@/Config/Constants'
import { Process } from '@/App/Utils'
import { Config } from '@/Config'
import { Console } from '@/Tools'

const coreLog = Console('[Core]')

// To run via typescript
const execArgv = ['-r', 'tsconfig-paths/register', '-r', 'ts-node/register']
const exec = join(`${__dirname}/Shard.ts`)
Cluster.setupMaster({ execArgv, exec })

export interface Broadcast {
  cmd: IPCEvents
  data?: any | any[]
}

const broadcast = async ({ cmd }: Broadcast) => {
  for (const pid in Cluster.workers) {
    await Cluster.workers[pid].send(cmd)
  }
}

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

const getClusters = (): number => {
  const MAX_WORKERS = cpus().length

  if (argv.has('enable-clusters')) {
    if (argv.has('clusters')) {
      const clusters = argv.get('clusters')

      if (clusters === 'auto') {
        return MAX_WORKERS
      } else if (typeof clusters === 'number') {
        return +clusters
      }

      coreLog.error('invalid arguments')
      process.exit(9)
    }

    return MAX_WORKERS
  } else if (env.useCluster) {
    // tslint:disable-next-line:no-extra-boolean-cast
    if (!!env.Clusters) {
      return +env.Clusters
    }

    return MAX_WORKERS
  }

  return 1
}

export const argv = getPureArguments()
export const numClusters = getClusters()

export const App = {
  closedClusters: 0,
  start() {
    const commonInfo = `${env.botName} v${pkg.version}`
    coreLog.log(`Start ${commonInfo}`)
    coreLog.log(argv)

    Process.setTitle(commonInfo)
    Config.initialise()
    App.initCluster()
    App.bindClusterEvent()
    App.bindEvent()

    process.emit(IPCEvents.READY as any)
  },

  initCluster() {
    coreLog.log('Initialise the shards')

    for (let clusterID = 0; clusterID < numClusters; clusterID++) {
      const clusterEnv = { SHARD_ID: clusterID, SHARD_COUNT: numClusters }

      Cluster.fork(clusterEnv)
    }
  },

  bindClusterEvent() {
    Cluster.on('online', Worker => {
      coreLog.log(`Cluster [PID: ${Worker.process.pid}] has started.`)
    })

    Cluster.on('exit', (Worker, Code, Signal) => {
      if (Code === 0) return

      // prettier-ignore
      coreLog.log(`Cluster [PID: ${Worker.process.pid}] has been shutdown abnormally. Received ${Signal} signal.`)
    })
  },

  bindEvent() {
    process.on('uncaughtException', async Error => coreLog.error(Error.stack))
    process.on('unhandledRejection', (reason, position) => {
      // prettier-ignore
      coreLog.error(`Occured unhandled rejection at: ${position} because of ${reason}`)

      broadcast({ cmd: IPCEvents.FORCE_SHUTDOWN })
    })

    process.on(IPCEvents.BROADCAST as any, broadcast)
    process.on(IPCEvents.FETCHUSER as any, () =>
      broadcast({ cmd: IPCEvents.FETCHUSER })
    )
    process.on(IPCEvents.FETCHCHANNEL as any, () =>
      broadcast({ cmd: IPCEvents.FETCHCHANNEL })
    )
    process.on(IPCEvents.FETCHGUILD as any, () =>
      broadcast({ cmd: IPCEvents.FETCHGUILD })
    )
    process.on(IPCEvents.SHUTDOWN as any, App.harmonyExit)
    process.on(IPCEvents.FORCE_SHUTDOWN as any, App.harmonyExit)

    // Prevents the master application from closing instantly.
    process.stdin.resume()
    process.on('SIGTERM', () => broadcast({ cmd: IPCEvents.SHUTDOWN }))
    process.on('SIGINT', () => broadcast({ cmd: IPCEvents.SHUTDOWN }))
    process.on('SIGUSR1', () => broadcast({ cmd: IPCEvents.SHUTDOWN }))
    process.on('SIGUSR2', () => broadcast({ cmd: IPCEvents.SHUTDOWN }))
  },

  harmonyExit() {
    ++App.closedClusters

    if (App.closedClusters >= numClusters) {
      coreLog.log('Master app is closing in harmony')
      process.exit(0)
    }
  }
}
