import { EventEmitter } from 'events'
import { Command, Group } from '@/App/Structs/Command.Struct'

const Player = new EventEmitter()

class Music extends Command {
  constructor() {
    super()

    this.cmds = 'music'
    this.aliases = ['m']
    this.description = ''
    this.group = Group.Music
    this.guildOnly = true
    this.bindEvent()
  }

  private bindEvent() {
    Player.on('play', this.play)
  }

  public async run() {
    const Connection = this.instance.Connections
    const GuildID = this.message.guild.id

    Player.emit(this.args[1])
    /*
    if (Connection.has(GuildID)) {
      const voiceConnection = Connection.get(GuildID)
    } else {
      if (this.message.member.voiceChannel) {
        Connection.set(GuildID, this.message.member.voiceChannel)
        Connection.get(GuildID).join()
      } else {
      }
    }
    */
  }

  public async play() {}
}

export default new Music()
