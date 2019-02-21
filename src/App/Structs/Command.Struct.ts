import * as Discord from 'discord.js'

import env from '@/Config/Constants'

import { Instance } from './Shard.Struct'
import { Permission } from './Permission.Struct'
import { RedisClient } from './Redis.Struct'

export const enum Group {
  Administrative = 'administrative',
  Generic = 'generic',
  Music = 'music'
}

export abstract class Command {
  /** Discord Instance */
  public instance: Instance

  /** Redis */
  public Redis: RedisClient

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

  /** Whether the command only be run in a guild channel */
  public guildOnly: boolean

  /** Whether the command only be used by an owner */
  public ownerOnly: boolean

  /** Whether the command only be used in NSFW channel */
  public nsfw: boolean

  /** Whether the command should be hidden from the help command */
  public hidden: boolean

  public isEnable: boolean

  public initialise(instance: Instance, Redis: RedisClient) {
    this.instance = instance
    this.aliases = []
    this.Redis = Redis
    this.isEnable = true
  }

  /** Hide this command from the help command */
  protected hide() {
    this.hidden = true
  }

  protected disable() {
    this.isEnable = false
  }

  public isOwner(): boolean {
    if (env.owners.includes(this.message.member.id)) {
      return true
    }

    return false
  }

  public hasPermission(PermissionType: Permission): boolean {
    if (this.message.member.hasPermission(PermissionType)) {
      return true
    }

    return false
  }

  public inspect() {
    this.message = this.instance.receivedData.get('message') as Discord.Message
    this.args = this.instance.receivedData.get('args') as string[]

    if (this.guildOnly && this.message.guild === null) {
      console.log('빼액')
      this.disable()
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
