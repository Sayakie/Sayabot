import * as Discord from 'discord.js'
import { Command, Group } from '@/App/Structs/Command.Struct'

class Music extends Command {
  constructor() {
    super()

    this.cmds = 'music'
    this.aliases = ['m']
    this.description = ''
    this.group = Group.Administrative
    this.guildOnly = true
    this.hide()
  }

  public async run() {
    const message = this.instance.receivedData.get('message') as Discord.Message
    // const args = this.instance.receivedData.get('args') as string[]

    await message.reply('늅!')
  }
}

export default new Music()
