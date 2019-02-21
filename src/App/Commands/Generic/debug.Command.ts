import * as pkg from 'package.json'
import { Command, Group } from '@/App/Structs/Command.Struct'

const embed = (literal: TemplateStringsArray, ...args: any[]) =>
  '```autohotkey\n' +
  literal.reduce((l, r, i) => l + (args[i - 1] || '') + r, '') +
  '\n```'

class Debug extends Command {
  constructor() {
    super()

    this.cmds = 'debug'
    this.aliases = []
    this.description = ''
    this.group = Group.Generic
  }

  public async run() {
    const debug = [
      '--------------- generic ---------------',
      `Sayabot Version : ${pkg.version}`,
      `       Guild ID : ${this.message.guild.id}`,
      `   Guild Region : ${this.message.guild.region}`,
      '',
      '-------------- connection --------------',
      ' Connection : false',
      '',
      '---------------- queue ----------------',
      '     Size : 0',
      ' Max Size : 500',
      ' Max Time : 86400'
    ]
    await this.message.channel.send(embed`${debug.join('\n')}`)
  }
}

export default new Debug()
