import { Command } from '@/App/Structs/Command.Struct'
import { Permission } from '@/App/Structs/Permission.Struct'

class play extends Command {
  constructor() {
    super()

    this.cmds = 'play'
    this.aliases = ['p', '재생']
    this.botRequirePermissions = [Permission.Connect, Permission.Speak]
  }

  public async run() {
    const voiceChannel = this.message.member.voiceChannel
    if (!voiceChannel) {
      await this.message.channel.send(
        `I'm sorry but you need to be in a voice channel to play music!`
      )
      return
    }
  }
}

export default new play()
