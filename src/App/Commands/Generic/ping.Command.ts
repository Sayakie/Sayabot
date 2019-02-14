import * as Discord from 'discord.js'
import { Command, Group } from '@/App/Structs/Command.Struct'
import { Console } from '@/Tools'

const tagged = (literal: TemplateStringsArray, ...args: any) =>
  '```autohotkey\n' +
  literal.reduce((l, r, i) => l + (args[i - 1] || '') + r, '') +
  '\n```'
const commandLog = Console('[Command]')

class Ping extends Command {
  constructor() {
    super()

    this.cmds = 'ping'
    this.description = ''
    this.group = Group.Generic
  }

  public async run() {
    const message = this.instance.receivedData.get('message') as Discord.Message

    await message.channel
      .send('Ping?')
      .then(async (msg: Discord.Message) => {
        await msg.edit(tagged`Pong! Took ${this.instance.ping} ms`)
      })
      .catch(commandLog.error)
  }
}

export default new Ping()
