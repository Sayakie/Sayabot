import { Command } from '@/App/Structs/Command.Struct'
import { Permission } from '@/App/Structs/Permission.Struct'

class leave extends Command {
  constructor() {
    super()

    this.cmds = 'leave'
    this.aliases = ['l', '떠나기', '퇴장']
    this.botRequirePermissions = [Permission.Connect, Permission.Speak]
  }

  public async run() {
    const voiceChannel = this.message.member.voiceChannel
    voiceChannel.leave()
    this.message.reply('음성 채널에서 나갔어요.')

    /*
    if (voiceChannel.type !== 'voice') {
      await this.message.reply('I could not connect to your voice channel!')
      return
    }

    if (!voiceChannel || !voiceChannel.joinable) {
      await this.message.reply(
        "I'm sorry but you need to be in a voice channel to perform that command."
      )
      return
    }

    voiceChannel.leave()
    */
  }
}

export default new leave()
