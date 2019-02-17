import * as Discord from 'discord.js'
import { Command } from '@/App/Structs/Command.Struct'

export interface Instance extends Discord.Client {
  receivedData?: Map<string, Discord.Message | string[]>
  commands?: Discord.Collection<string, Command>
  Connections?: Map<any, any>
}
