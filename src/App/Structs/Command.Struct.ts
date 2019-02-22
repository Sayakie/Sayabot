import * as Discord from 'discord.js'

import { Instance } from './Shard.Struct'
import { Permission } from './Permission.Struct'
// import { RedisClient } from './Redis.Struct'

// TODO: Functional -> 권한 있는지 확인하기
const reviewBot = ''

export const enum Group {
  Administrative = 'administrative',
  Generic = 'generic',
  Music = 'music'
}

export abstract class Command {
  /** Discord Instance */
  public instance: Instance

  /** Redis */
  // public Redis: RedisClient

  /** Received message */
  public message: Discord.Message

  /** Received args */
  public args: string[]

  /** Name of this command */
  public cmds: string

  /** Aliases for this command */
  public aliases: string[]

  /** Short description of the command  */
  public description: string

  /** Long description of the command  */
  public details: string

  /** Usage format string of the command */
  public format: string

  /** The group name of the command belongs to */
  public group: string

  /** The privileges of the command to perform for user */
  public userRequirePermissions: Permission[]

  /** The privileges of the command to perform for bot */
  public botRequirePermissions: Permission[]

  /** Whether the command only be run in a guild channel */
  public guildOnly: boolean

  /** Whether the command only be used by an owner */
  public ownerOnly: boolean

  /** Whether the command only be used in NSFW channel */
  public nsfw: boolean

  /** Whether the command should be hidden from the help command */
  public hidden: boolean

  protected constructor() {
    this.aliases = []
    this.userRequirePermissions = []
    this.botRequirePermissions = []
  }

  /**  */
  public initialise(instance: Instance) {
    this.instance = instance
  }

  /** Hide this command from the help command */
  protected hide() {
    this.hidden = true
  }

  public inspect() {
    this.message = this.instance.receivedData.get('message') as Discord.Message
    this.args = this.instance.receivedData.get('args') as string[]

    const botStats = {
      hasPerms: true,
      missPerms: [] as string[]
    }

    this.botRequirePermissions.forEach(Privilege => {
      const hasPrivilege = (this.message.channel as Discord.TextChannel)
        .permissionsFor(this.message.guild.member(this.instance.user))
        .has(Privilege)

      if (!hasPrivilege) {
        botStats.hasPerms = false
        botStats.missPerms.push(`\`${Privilege}\``)
      }
    })
  }
  public async inspect2(): Promise<this> {
    this.message = this.instance.receivedData.get('message') as Discord.Message
    this.args = this.instance.receivedData.get('args') as string[]

    return new Promise((resolve, reject) => {
      const botStats = {
        hasPerms: true,
        missPerms: [] as string[]
      }
      this.botRequirePermissions.forEach(privilege => {
        const hasPrivilege = (this.message.channel as Discord.TextChannel)
          .permissionsFor(this.message.guild.member(this.instance.user))
          .has(privilege)

        if (!hasPrivilege) {
          botStats.hasPerms = false
          botStats.missPerms.push(`\`${privilege}\``)
        }
      })

      if (!botStats.hasPerms) {
        this.message.channel.send(
          `I was unable to proceed that command because I lack the permission(s): ${botStats.missPerms.join(
            ', '
          )}`
        )

        reject(
          `Could not proceed some command because the bot does not have permission(s): ${botStats.missPerms.join(
            ', '
          )}`
        )
      }

      resolve(this)
    })
  }

  /** Runs the command */
  public async run() {
    throw new Error(
      `${this.constructor.name} command does not have a run() method.`
    )
  }
}
