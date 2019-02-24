import * as Discord from 'discord.js'

import { Instance } from './Shard.Struct'
import { Permission } from './Permission.Struct'
// import { RedisClient } from './Redis.Struct'

// TODO: Functional -> 권한 있는지 확인하기
// const reviewBot = ''

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
  public _guildOnly: boolean

  /** Whether the command only be used by an owner */
  public _ownerOnly: boolean

  /** Whether the command only be used in NSFW channel */
  public nsfw: boolean

  /** Whether the command should be hidden from the help command */
  public hidden: boolean

  protected constructor() {
    this.aliases = []
    this.format = ''
    this.userRequirePermissions = []
    this.botRequirePermissions = []
  }

  /** Initialise the command */
  public initialise(instance: Instance) {
    this.instance = instance
    this.format = this.overlay(this.format)
  }

  /** Make the command for only guild */
  protected guildOnly() {
    this._guildOnly = true
  }

  /** Make the command for only owner */
  protected ownerOnly() {
    this._ownerOnly = true
  }

  /** Hide this command from the help command */
  protected hide() {
    this.hidden = true
  }

  protected overlay(s: string) {
    return s.replace(/{PREFIX}/gi, process.env.BOT_PREFIX)
  }

  public inject(message: Discord.Message, args: string[]) {
    this.message = message
    this.args = args

    return this
  }

  public inspect() {
    // Check user has sufficient permissions to perform the command
    const userStats = {
      hasPerms: true,
      missPerms: [] as string[]
    }

    this.userRequirePermissions.forEach(Privilege => {
      const hasPrivilege = (this.message.channel as Discord.TextChannel)
        .permissionsFor(this.message.author)
        .has(Privilege)

      if (!hasPrivilege) {
        userStats.hasPerms = false
        userStats.missPerms.push(`\`${Privilege}\``)
      }
    })

    // Check bot has sufficient permisisons to perform the command
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

    if (!userStats.hasPerms || !botStats.hasPerms) {
      const subject = !userStats.hasPerms ? 'you' : 'I'
      const lacks = !userStats.hasPerms
        ? botStats.missPerms
        : userStats.missPerms
      // prettier-ignore
      this.message.channel.send(`I was unable to proceed that command because ${subject} lack the permission(s): ${lacks.join(', ')}`)

      // @ts-ignore
      return
    }

    return this
  }

  /** Runs the command */
  public async run() {
    throw new Error(
      `${this.constructor.name} command does not have a run() method.`
    )
  }
}
