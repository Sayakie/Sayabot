import { EventEmitter } from 'events'

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

  public async join() {}

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
