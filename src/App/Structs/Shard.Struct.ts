import * as Discord from 'discord.js'
import { Command } from '@/App/Structs/Command.Struct'

export interface Instance extends Discord.Client {
  commands?: Map<string, Command>
  Connections?: Map<string, Discord.VoiceChannel>
}
