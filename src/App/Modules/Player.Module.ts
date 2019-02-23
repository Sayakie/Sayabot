import { EventEmitter } from 'events'
import * as Discord from 'discord.js'

interface TimeFormat {
  showHour: boolean
  showMin: boolean
  showSec: boolean
  padHour: boolean
  padMin: boolean
  padSec: boolean
  sepHour: string
  sepMin: string
  sepSec: string
}

class Player extends EventEmitter {
  private readonly connections = new Discord.Collection<
    string,
    Discord.VoiceConnection
  >()
  private timeFormat: TimeFormat
  public constructor() {
    super()

    this.timeFormat = {
      showHour: false,
      showMin: true,
      showSec: true,
      padHour: false,
      padMin: true,
      padSec: true,
      sepHour: ':',
      sepMin: ':',
      sepSec: ''
    }
  }

  public async join(channel: Discord.VoiceChannel) {
    return new Promise((resolve, reject) => {
      if (!channel.joinable) {
        if (channel.full) {
          throw new Error(
            'I do not have permission to join this voice channel! It is full.'
          )
        } else {
          throw new Error('I do not have permission to join this voice channel')
        }
      }

      const Connection = this.connections.get(channel.guild.id)

      if (Connection) {
        if (Connection.channel.id !== channel.id) {
          this.connections.get(channel.guild.id).updateChannel(channel)
        }
      }
    })
  }

  public async leave() {}

  public async play() {}

  public async pause() {}

  public async stop() {}

  public async mute() {}

  public async unmute() {}

  public async getVolumeState() {}

  public async getRepeatState() {}

  public async getCurrentTime() {}

  public async getDuration() {}

  public async bindEvent() {}
}

export default new Player()
