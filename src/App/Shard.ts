import * as fs from 'fs'
import * as Discord from 'discord.js'
import * as Redis from 'redis'
import { join } from 'path'

import * as pkg from 'package.json'
import * as config from '@/Config/Config.json'
import * as db from '@/Config/DBConfig.json'
import env, { IPCEvents } from '@/Config/Constants'
import { Instance } from '@/App/Structs/Shard.Struct'
import { Command } from '@/App/Structs/Command.Struct'
import { Process } from '@/App/Utils'
import { Console } from '@/Tools'

const { SHARD_ID: shardId, SHARD_COUNT: shardCount } = process.env
const shardLog = Console('[Shard]')
const disabledEvents: Discord.WSEventType[] = ['TYPING_START']

type ActivityType = 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING'
interface ActivityOptions {
  url?: string
  type?: ActivityType | number
}

class Shard {
  private readonly shardId = Number.parseInt(shardId, 10)
  private readonly shards = Number.parseInt(shardCount, 10)
  private instance: Instance
  private Redis: Redis.RedisClient = Redis.createClient({
    port: db.RedisDBPort,
    host: db.RedisDBHort
  })
  private Cycle: NodeJS.Timeout

  public constructor() {
    Process.setTitle(`${env.botName} v${pkg.version} - ${process.pid}`)

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
        this.instance.login(config.token)
        this.instance.receivedData = new Map()
        this.instance.commands = new Discord.Collection()
        this.loadCommand()
        this.bindEvent()
      })
      .catch(shardLog.error)
  }

  private readonly isExistsShard = (): Promise<void> =>
    new Promise((resolve, reject) => {
      if (shardId && shardCount) {
        resolve()
      } else {
        reject('Could not run Shard directly.')
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
    this.createCycle()
    this.setStatus('online')
    this.setActivity(`${this.instance.users.size} Users`, {
      url: 'https://sayakie.com',
      type: 'LISTENING'
    })
    process.send(IPCEvents.SHARDREADY)

    // prettier-ignore
    shardLog.log(`Logged in as: ${this.instance.user.tag}, with ${this.instance.users.size} users of ${this.instance.guilds.size} servers.`)
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

      command.initialise(this.instance)
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
      message.author.bot ||
      message.content.indexOf(config.commandPrefix) !== 0
    ) {
      return
    }

    // prettier-ignore
    const raw = message.cleanContent.slice(config.commandPrefix.length).trim().split(/\s+/g)
    const command = raw.shift().toLowerCase()
    const receivedData = { message, raw }

    // Ignore if there are no applicable command
    if (!this.instance.commands.has(command)) {
      // prettier-ignore
      shardLog.log(`${message.author.tag} said ${message} but there are no applicable commands. skip it.`)
      message.channel.send(
        `${message.author.tag}, there are no applicable commands!`
      )
      return
    }

    for (const key of Object.keys(receivedData)) {
      this.instance.receivedData.set(key, (<any>receivedData)[key])
    }

    try {
      await this.instance.commands.get(command).run()
    } catch (error) {
      await message.channel.send(
        'There ware an error while try to run that command!'
      )
      shardLog.error(
        `The following command could not be executed, because of ${error}`
      )
    }
  }

  private readonly syncRedis = async () => {
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
  }

  private readonly bindEvent = () => {
    this.instance.once('ready', this.ready)
    this.instance.on('message', this.onMessage)

    this.instance.on('warn', shardLog.warn)
    this.instance.on('error', shardLog.error)

    this.Redis.on('warn', shardLog.warn)
    this.Redis.on('error', shardLog.error)

    process.on(IPCEvents.SHUTDOWN as any, this.shutdown)
    process.on(IPCEvents.FORCE_SHUTDOWN as any, () =>
      this.shutdown(IPCEvents.FORCE_SHUTDOWN)
    )

    process.on('message', (cmd: IPCEvents) => process.emit(cmd as any))
    process.on('SIGTERM', () => {
      /** dummy return */
    })
    process.on('SIGINT', () => {
      /** dummy return */
    })
    process.on('SIGUSR1', () => {
      /** dummy return */
    })
    process.on('SIGUSR2', () => {
      /** dummy return */
    })
  }

  private readonly createCycle = () => {
    const sec = 1000

    // @ts-ignore
    this.Cycle = setInterval(this.syncRedis().catch(shardLog.error), 30 * sec)
  }

  private readonly shutdown = async (
    Events: IPCEvents = IPCEvents.SHUTDOWN
  ): Promise<void> => {
    clearInterval(this.Cycle)

    if (env.useRedis) {
      this.Redis.quit()
    }

    await this.instance.destroy()
    process.send(Events)
    process.exit(0)
  }
}

export default new Shard()
