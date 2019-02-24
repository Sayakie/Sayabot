import * as fs from 'fs'
import * as Discord from 'discord.js'
// import * as Redis from 'redis'
import { EventEmitter } from 'events'
import { join } from 'path'
// import { promisifyAll } from 'bluebird'

import C, { IPCEvents, version } from '@/Config/Constants'
import { ClientManager } from '@/App/Internal/ClientManager'
import { Instance } from '@/App/Structs/Shard.Struct'
import { Command } from '@/App/Structs/Command.Struct'
// import { RedisClient } from '@/App/Structs/Redis.Struct'
import { Process, MILLISECONDS_A_SECOND } from '@/App/Utils'
import { Console } from '@/Tools'

const {
  SHARD_ID: shardId,
  SHARD_COUNT: shardCount,
  BOT_TOKEN,
  BOT_PREFIX
  /*
  IPC_MASTER_ID,
  IPC_CLUSTER_ID_PREFIX
  */
} = process.env
const shardLog = Console('[Shard]')
const disabledEvents: Discord.WSEventType[] = [
  'TYPING_START',
  'CHANNEL_PINS_UPDATE',
  'USER_NOTE_UPDATE',
  'USER_SETTINGS_UPDATE',
  'USER_GUILD_SETTINGS_UPDATE',
  'VOICE_STATE_UPDATE'
]

type ActivityType = 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING'
interface ActivityOptions {
  url?: string
  type?: ActivityType | number
}

export class Shard extends EventEmitter {
  public readonly shardId = Number.parseInt(shardId, 10)
  public readonly shards = Number.parseInt(shardCount, 10)
  private isReady: boolean
  /*
  private isInstanceReady: boolean
  private isRedisReady: boolean
  */
  private instance: Instance
  private manager: ClientManager
  // private Redis: RedisClient
  private readonly _timeouts = new Set()
  private readonly _intervals = new Set()

  public constructor() {
    super()
    Process.setTitle(`${C.botName} v${version} - ${process.pid}`)

    this.isExistsShard()
      .then(() => {
        this.instance = new Discord.Client({
          shardId: this.shardId,
          shardCount: this.shards,
          disabledEvents,
          messageCacheMaxSize: 25,
          messageCacheLifetime: 120,
          messageSweepInterval: 120
        })
        this.instance.login(BOT_TOKEN)
        this.instance.commands = new Map()
        this.manager = new ClientManager(this)
        this.manager.register()
        this.loadConnection()
        this.loadCommand()
        this.bindEvent()
      })
      /*
      .then(() => {
        try {
          promisifyAll(Redis.RedisClient.prototype)
          promisifyAll(Redis.Multi.prototype)
        } catch {
          // uwu *
        }
      })
      */
      .catch(shardLog.error)
  }

  private readonly isExistsShard = (): Promise<void> =>
    new Promise((resolve, reject) => {
      if (shardId && shardCount) {
        resolve()
      } else {
        reject('Could not run Shard directly')
      }
    })

  private readonly walkSync = (
    dir: string,
    fileLikeArray: string[] = []
  ): string[] => {
    // @see https://gist.github.com/kethinov/6658166
    const files = fs.readdirSync(dir)

    files.forEach(file => {
      if (fs.statSync(`${dir}/${file}`).isDirectory()) {
        fileLikeArray = this.walkSync(join(dir, file), fileLikeArray)
      } else {
        fileLikeArray.push(join(dir, file))
      }
    })

    return fileLikeArray
  }

  private readonly setStatus = (status: Discord.PresenceStatus) => {
    this.instance.user.setStatus(status)
  }

  private readonly setActivity = (
    activity: string,
    options?: ActivityOptions
  ) => {
    this.instance.user.setActivity(activity, options)
  }

  private readonly ready = () => {
    this.setStatus('online')
    this.setActivity('Connect to ')
    /*
    this.setActivity(`${this.instance.users.size} Users`, {
      url: 'https://sayakie.com',
      type: 'LISTENING'
    })
    */

    this.createCycle()
    this.createDebugCycle()
    // this.emit(IPCEvents.SHARDREADY)
    this.isReady = true

    shardLog.log(
      `Logged in as: ${this.instance.user.tag}, with ${
        this.instance.users.size
      } users of ${this.instance.guilds.size} servers`
    )
  }

  private readonly loadConnection = () => {
    // tslint:disable-next-line:prefer-conditional-expression
    if (C.useRedis) {
      this.instance.Connections = new Map()
    } else {
      this.instance.Connections = new Map()
    }
  }

  private readonly loadCommand = () => {
    const commandDir = join(`${__dirname}/Commands`)
    const commandFiles = this.walkSync(commandDir).filter(
      file =>
        file.includes('.Command') &&
        (file.endsWith('ts') || file.endsWith('js'))
    )

    commandFiles.forEach(file => {
      const command = require(file).default as Command

      command.initialise(this.instance /* this.Redis */)
      command.aliases.unshift(command.cmds)
      command.aliases.forEach(cmd => {
        this.instance.commands.set(cmd, command)
      })
    })
  }

  private readonly onMessage = async (message: Discord.Message) => {
    // Ignore all messages from other bots
    // or, ignore all messages that not start with command prefix
    if (
      !this.isReady ||
      !message.content.startsWith(BOT_PREFIX) ||
      message.author.bot
    ) {
      return
    }

    const args = message.cleanContent
      .slice(BOT_PREFIX.length)
      .trim()
      .split(/\s+/g)
    const command = args.shift().toLowerCase()

    // Ignore if there are no applicable command
    if (!this.instance.commands.has(command)) {
      // prettier-ignore
      shardLog.log(`${message.author.tag} said ${message} but there are no applicable command`)
      return
    }

    try {
      await this.instance.commands
        .get(command)
        .inject(message, args)
        .inspect()
        .run()
    } catch (error) {
      shardLog.error(error)
    }
  }

  // private readonly onMessageDelete = async()

  private readonly syncStats = async () => {
    /*
    if (env.useRedis) {
      await this.Redis.set(
        `SHARD_${this.shardId}_GUILD_SIZE`,
        `${this.instance.guilds.size}`
      )
      await this.Redis.set(
        `SHARD_${this.shardId}_USER_SIZE`,
        `${this.instance.guilds
          .map(guild => guild.memberCount)
          .reduce((prev, cnt) => prev + cnt)}`
      )
    }
    */
  }

  // @ts-ignore
  private readonly setTimeout = (
    fn: Function,
    delay: number,
    ...args: any[]
  ) => {
    const timeout = setTimeout(() => {
      fn(...args)

      this._timeouts.delete(timeout)
    }, delay)

    this._timeouts.add(timeout)
    return timeout
  }

  private readonly clearTimeout = (timeout: NodeJS.Timeout) => {
    clearTimeout(timeout)
    this._timeouts.delete(timeout)
  }

  private readonly setInterval = (
    fn: Function,
    delay: number,
    ...args: any[]
  ) => {
    const interval = setInterval(fn, delay, ...args)

    this._intervals.add(interval)
    return interval
  }

  private readonly clearInterval = (interval: NodeJS.Timeout) => {
    clearInterval(interval)
    this._intervals.delete(interval)
  }

  private readonly bindEvent = () => {
    this.instance.once('ready', this.ready)
    this.instance.on('message', this.onMessage)
    // this.instance.on('messageDelete', this.onMessageDelete)
    // this.instance.on('messageDeleteBulk', this.onMessageDelete)
    // this.instance.on('messageUpdate', someListener)
    // this.instance.on('guildCreate', listener: (guild: Guild))
    // this.instance.on('guildDelete', listener: (guild: Guild))

    this.instance.on('warn', shardLog.warn)
    this.instance.on('error', shardLog.error)

    // this.Redis.on('warn', shardLog.warn)
    // this.Redis.on('error', shardLog.error)

    process.on(IPCEvents.SHUTDOWN as any, this.shutdown)
    process.on(IPCEvents.FORCE_SHUTDOWN as any, this.shutdown)

    // process.on('message', (cmd: IPCEvents) => process.emit(cmd as any))
    process.on('SIGINT', this.shutdown)
  }

  private readonly createCycle = () => {
    this.setInterval(this.syncStats, 30 * MILLISECONDS_A_SECOND)
  }

  private readonly createDebugCycle = () => {
    const Debugger = () => {
      const memoryUsed = (process.memoryUsage().rss / 1024 / 1024).toFixed(2)

      this.emit('debug', `Used ${memoryUsed} MB`)
    }

    this.setInterval(Debugger, 5 * MILLISECONDS_A_SECOND)
  }

  private readonly shutdown = async () => {
    for (const t of this._timeouts) this.clearTimeout(t)
    for (const i of this._intervals) this.clearInterval(i)
    this._timeouts.clear()
    this._intervals.clear()

    if (C.useRedis) {
      // await this.Redis.quitAsync()
    }

    try {
      await this.instance.destroy()
    } catch (err) {
      shardLog.error(err)
    }
  }
}

export default new Shard()
