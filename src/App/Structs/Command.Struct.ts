import * as Redis from 'redis'

import * as db from '@/Config/DBConfig.json'
import { Instance } from './Shard.Struct'

export const enum Group {
  Administrative = 'administrative',
  Generic = 'generic'
}

export abstract class Command {
  /** Discord Instance */
  public instance: Instance

  /** Received message */
  public message: string

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

  public Client: Redis.RedisClient = Redis.createClient({
    port: db.RedisDBPort,
    host: db.RedisDBHort
  })

  public constructor() {
    this.aliases = []
  }

  public initialise(instance: Instance): void {
    this.instance = instance
  }

  /** Hide this command from the help command */
  protected hide(): void {
    this.hidden = true
  }

  public hasPermission(): void {
    // if (this.ownerOnly)
  }

  /** Runs the command */
  public async run(): Promise<void> {
    throw new Error(
      `${this.constructor.name} command does not have a run() method.`
    )
  }
}
