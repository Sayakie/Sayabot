import { pkg } from '@/Config/Constants'
import { Command, Group } from '@/App/Structs/Command.Struct'

const embed = (literal: TemplateStringsArray, ...args: any[]) =>
  '```autohotkey\n' +
  literal.reduce((l, r, i) => l + (args[i - 1] || '') + r, '') +
  '\n```'

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

class Debug extends Command {
  constructor() {
    super()

    this.cmds = 'debug'
    this.aliases = ['troubleshoot']
    this.description = 'Prints the debug infomation'
    this.format = '{PREFIX}debug'
    this.group = Group.Generic
    this.guildOnly()
  }

  public async run() {
    const guildID = this.message.guild.id
    const guildRegion = capitalize(this.message.guild.region)

    const debugInfo = [
      '--------------- generic ---------------',
      `Sayabot Version : ${pkg.version}`,
      `       Guild ID : ${guildID}`,
      `   Guild Region : ${guildRegion}`,
      '',
      '-------------- connection --------------',
      ' Connection : false',
      '',
      '---------------- queue ----------------',
      '     Size : 0',
      ' Max Size : 500',
      ' Max Time : 86400'
    ]

    await this.message.channel.send(embed`${debugInfo.join('\n')}`)
  }
}

export default new Debug()
