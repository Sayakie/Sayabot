import { pkg } from '@/Config/Constants'
import { Command, Group } from '@/App/Structs/Command.Struct'
import { Embed, Capitalize } from '@/App/Utils'

const ah = Embed('autohotkey')

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
    const guildID = +this.message.guild.id
    const guildRegion = Capitalize(this.message.guild.region)

    const debugInfo = [
      '--------------- generic ---------------',
      ` Sayabot Version : ${pkg.version}`,
      `        Guild ID : ${guildID}`,
      `    Guild Region : ${guildRegion}`,
      '',
      '-------------- connection --------------',
      ' Connection : false',
      '',
      '---------------- queue ----------------',
      '     Size : 0',
      ' Max Size : 500',
      ' Max Time : 86400'
    ]

    await this.message.channel.send(ah`${debugInfo.join('\n')}`)
  }
}

export default new Debug()
