import { Command } from '@/App/Structs/Command.Struct'
import { Permission } from '@/App/Structs/Permission.Struct'
import { Console } from '@/Tools'

const ws = Console('[ws]')

class join extends Command {
  constructor() {
    super()

    this.cmds = 'join'
    this.aliases = ['j', '입장']
    this.botRequirePermissions = [Permission.Connect, Permission.Speak]
  }

  public async run() {
    const voiceChannel = this.message.member.voiceChannel

    if (voiceChannel) {
      await voiceChannel
        .join()
        .then(() => this.message.reply('음성 채널에 들어왔습니다!'))
        .catch(ws.error)
    } else {
      await this.message.reply('먼저 음성 채널에 들어와주세요!')
    }

    /*
    if (voiceChannel.type !== 'voice') {
      await this.message.reply('I could not connect to your voice channel!')
      return
    }

    if (!voiceChannel || !voiceChannel.joinable) {
      if (voiceChannel.full) {
        await this.message.reply(
          'I do not have permission to join your voice channel. That channel seems look full.'
        )
        return
      }

      await this.message.reply(
        "I'm sorry but you need to be in a voice channel to play music!"
      )
      return
    }

    await voiceChannel.join()
    */
  }
}

export default new join()
