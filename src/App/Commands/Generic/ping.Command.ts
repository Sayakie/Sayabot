import * as Discord from 'discord.js'
import { Command, Group } from '@/App/Structs/Command.Struct'
import { Embed } from '@/App/Utils'
import { Console } from '@/Tools'

const tagged = Embed('autohotkey')
const commandLog = Console('[Command]')

class Ping extends Command {
  constructor() {
    super()

    this.cmds = 'ping'
    this.description = ''
    this.group = Group.Generic
  }

  public async run() {
    await this.message.channel
      .send('Ping?')
      .then(async (msg: Discord.Message) => {
        await msg.edit(
          tagged`Pong! Took ${msg.createdTimestamp -
            this.message.createdTimestamp} ms. API Latency tooks ${Math.round(
            this.instance.ping
          )}ms`
        )
      })
      .catch(commandLog.error)
  }
}

export default new Ping()
