import * as Cluster from 'cluster'
import { ChildProcess } from 'child_process'
import { cpus } from 'os'
import { join } from 'path'

import * as pkg from 'package.json'
import C, { IPCEvents } from '@/Config/Constants'
import { Process } from '@/App/Utils'
import { Config } from '@/Config'
import { Console } from '@/Tools'

const coreLog = Console('[Core]')

// To run via typescript
if (Cluster.isMaster) {
  const execArgv = ['-r', 'tsconfig-paths/register', '-r', 'ts-node/register']
  const exec = join(`${__dirname}/Shard.ts`)
  Cluster.setupMaster({ execArgv, exec })
}

export interface Broadcast {
  cmd: IPCEvents
  data?: any | any[]
}

interface ClusterProcess extends ChildProcess {
  env?: NodeJS.ProcessEnv
}

interface Cluster extends Cluster.Worker {
  process: ClusterProcess
}

const getPureArguments = () => {
  const PureArguments = new Map<string, any>()

  // Remove two factors from argv that never need
  process.argv.splice(0, 2)
  process.argv
    .filter(arg => arg.match(/^-(!-)/))
    .forEach(arg => {
      process.argv.splice(process.argv.indexOf(arg, 1), 1)

      PureArguments.set(arg.slice(1), true)
    })
  process.argv
    .filter(arg => arg.includes('--'))
    .forEach((_, i) =>
      PureArguments.set(process.argv[i * 2].slice(2), process.argv[++i * 2 - 1])
    )

  return PureArguments
}

const getClusters = () => {
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
  } else if (C.useCluster) {
    // tslint:disable-next-line:no-extra-boolean-cast
    if (!!C.Clusters) {
      return +C.Clusters
    }

    return MAX_WORKERS
  }

  return 1
}

export const argv = getPureArguments()
export const numClusters = getClusters()

export const App = {
  /*
  closedClusters: 0,
  lastestCluster: null as Cluster.Worker,
  Clusters: [] as Cluster.Worker[],
  */

  start() {
    const commonInfo = `${C.botName} v${pkg.version}`
    coreLog.log(`Start ${commonInfo}`)
    coreLog.log(argv)

    Process.setTitle(commonInfo)
    Config.initialise()
    App.initCluster()
    App.bindEvent()
    App.bindClusterEvent()

    process.emit(IPCEvents.READY as any)
  },

  broadcast({ cmd }: Broadcast) {
    // tslint:disable:no-shadowed-variable
    // App.Clusters.forEach(Cluster => Cluster.send(cmd))
    for (const pid in Cluster.workers) {
      Cluster.workers[pid].send(cmd)
    }
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

    Cluster.on('exit', (Worker: Cluster, Code, Signal) => {
      if (Code === 0) return

      // prettier-ignore
      coreLog.log(`Cluster [PID: ${Worker.process.pid}] has been shutdown abnormally. Received ${Signal} signal.`)
    })
  },

  bindEvent() {
    process.on('uncaughtException', Error => coreLog.error(Error.stack))
    process.on('unhandledRejection', (reason, position) => {
      // prettier-ignore
      coreLog.error(`Occured unhandled rejection at: ${position} because of ${reason}`)
    })

    process.on(IPCEvents.BROADCAST as any, App.broadcast)
    process.on(IPCEvents.SHUTDOWN as any, App.shutdown)
    process.on(IPCEvents.FORCE_SHUTDOWN as any, App.shutdown)

    process.once('SIGTERM', App.shutdown)
    process.once('SIGINT', App.shutdown)
    process.once('SIGUSR1', App.shutdown)
    process.once('SIGUSR2', App.shutdown)
  },

  shutdown() {
    for (const pid in Cluster.workers) {
      try {
        Cluster.workers[pid].destroy()
      } catch (err) {
        coreLog.error(err)
      }
    }

    coreLog.log('Received shutdown signal')
    process.exit(0)
  }
}
