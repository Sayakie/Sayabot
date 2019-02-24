// import * as readline from 'readline'
import * as fs from 'fs'
import * as Cluster from 'cluster'
import { ChildProcess } from 'child_process'
import { cpus } from 'os'
import { join } from 'path'

import C, { IPCEvents, PromptEvents, version } from '@/Config/Constants'
import { Process } from '@/App/Utils'
import { Config } from '@/Config'
import { Console } from '@/Tools'

// let Prompt: readline.Interface
const coreLog = Console('[Core]')
const {
  /*IPC_MASTER_ID, IPC_HOST, IPC_PORT,*/ NUMBER_OF_PROCESSORS
} = process.env

// To run via typescript
if (Cluster.isMaster) {
  if (fs.existsSync(join(`${__dirname}/Shard.ts`))) {
    const execArgv = ['-r', 'tsconfig-paths/register', '-r', 'ts-node/register']
    const exec = join(`${__dirname}/Shard.ts`)
    Cluster.setupMaster({ execArgv, exec, inspectPort: 1320 })
  } else {
    const exec = join(`${__dirname}/Shard.js`)
    Cluster.setupMaster({ exec })
  }

  /*
  IPC.config.id = IPC_MASTER_ID
  IPC.config.retry = 1500
  IPC.config.silent = true
  // IPC.config.maxConnections = numClusters

  /*
  Prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  Prompt.setPrompt('> ')
  Prompt.on('line', line => {
    coreLog.log(line.toUpperCase())
    process.emit(line.toUpperCase() as any)
    Prompt.prompt()
  })
  Prompt.once('close', () => process.emit(PromptEvents.EXIT as any))
  */
}

export interface Broadcast {
  cmd: IPCEvents
  args?: any | any[]
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
    .filter(arg => arg.startsWith('--'))
    .forEach((_, i) =>
      PureArguments.set(process.argv[i * 2].slice(2), process.argv[++i * 2 - 1])
    )

  return PureArguments
}

const getClusters = () => {
  const MAX_WORKERS = +NUMBER_OF_PROCESSORS || cpus().length

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
    const commonInfo = `${C.botName} v${version}`
    coreLog.log(`Start ${commonInfo}`)
    coreLog.log(argv)

    Process.setTitle(commonInfo)
    Config.initialise()
    App.validateOptions()
    // App.serveIPC()
    App.initCluster()
    App.bindEvent()
    App.bindClusterEvent()

    process.emit(IPCEvents.READY as any)
  },

  broadcast(data: Broadcast) {
    // tslint:disable:no-shadowed-variable
    // App.Clusters.forEach(Cluster => Cluster.send(cmd))
    for (const pid in Cluster.workers) {
      Cluster.workers[pid].send(data.cmd, ...data.args)
    }
  },

  serveIPC() {
    /*
    IPC.serveNet(IPC_HOST, +IPC_PORT)
    IPC.server.start()

    coreLog.log('IPC Server is ready')
    */
  },

  validateOptions() {
    if (typeof C.botName !== 'string') {
      throw new TypeError('The botName option must be a string.')
    }

    if (typeof C.useCluster !== 'boolean') {
      throw new TypeError('The useCluster option must be a boolean.')
    }

    if (typeof C.Clusters !== ('boolean' || 'number')) {
      throw new TypeError('The Clusters option must be a boolean or number.')
    }

    if (typeof C.Clusters === 'number' && C.Clusters < 0) {
      throw new RangeError('The Clusters option must be at least 0.')
    }

    if (typeof C.enableDebug !== 'boolean') {
      throw new TypeError('The enableDebug option must be a boolean.')
    }

    if (!(C.owners instanceof Array)) {
      throw new TypeError('The owners option must be an Array.')
    }

    if (argv.has('enable-clusters')) {
      if (
        typeof +argv.get('clusters')! !== 'number' ||
        isNaN(argv.get('clusters'))
      ) {
        throw new TypeError('The clusters argument must be a number.')
      }
    }
  },

  initCluster() {
    coreLog.log('Initialise the shards')

    for (let clusterID = 0; clusterID < numClusters; clusterID++) {
      const clusterEnv = {
        SHARD_ID: clusterID,
        SHARD_COUNT: numClusters
      }

      Cluster.fork(clusterEnv)
    }
  },

  bindClusterEvent() {
    Cluster.on('online', Worker => {
      coreLog.log(`Cluster [PID: ${Worker.process.pid}] has started.`)
    })

    Cluster.on('exit', (Worker: Cluster, Code) => {
      if (Code === 0) return

      coreLog.log(
        `Cluster [PID: ${Worker.process.pid}] has been shutdown abnormally.`
      )
    })
  },

  bindEvent() {
    process.on('uncaughtException', Error => coreLog.error(Error.stack))
    process.on('unhandledRejection', (reason, position) => {
      coreLog.error(
        `Occured unhandled rejection at: ${position} because of ${reason}`
      )
    })

    process.on(IPCEvents.BROADCAST as any, App.broadcast)
    process.on(IPCEvents.SHUTDOWN as any, App.shutdown)
    process.on(IPCEvents.FORCE_SHUTDOWN as any, App.shutdown)
    process.on(PromptEvents.EXIT as any, App.shutdown)

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
