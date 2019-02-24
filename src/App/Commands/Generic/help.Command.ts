/**
 * To use a command, do `--<Command name> [arguments]`, for example `--help`
 * <> = Required
 * [] = Optional
 *
 * The full description for all commands is also available at https://bot.sayakie.com/commands, so take a look if youre lost :)
 *
 * If you want to ask a question, feel free to join my support server
 *
 * :wrench: Util: ytsearch
 * :headphones: Music: queue, bassboost, play, daycore, pause, skip, stop, nowplaying, nightcore, shuffle, repeat, equalizer, setspeed, volume
 * :ballot_box: Info: userinfo, ping, help
 */
import * as Discord from 'discord.js'

import C from '@/Config/Constants'
import { Command, Group } from '@/App/Structs/Command.Struct'

class Help extends Command {
  constructor() {
    super()

    this.cmds = 'help'
    this.aliases = ['guide', 'see']
    this.description = 'Prints all helps for Sayabots'
    this.format = '{PREFIX}help [command]'
    this.group = Group.Generic
    this.hide()
  }

  public async run() {
    const helpEmbed = new Discord.RichEmbed()
    const commands = Array.from(this.instance.commands.keys()).map(cmd => {
      const command = this.instance.commands.get(cmd) as Command

      if (command.hidden) return ''

      return `**${command.cmds}** - ${command.description}`
    })
    /*
    const guidInfo = [
      'To use a command, do `{PREFIX}<Command name>` [arguments]',
      '<> is required / [] is optional\n',
      'The full description for all commands is also available at {WEBSITE}, so take a look if youre lost :D\n',
      'If you want to ask a question, feel free to join my support server\n',
      '{COMMANDLIST}\n\n',
      'Official discord server: https://discord.gg/~~~'
    ]
    */

    helpEmbed.setColor(0x00ae86)
    helpEmbed.setDescription(`**Hello, I'm ${C.botName}!**`)
    helpEmbed.addField(
      '\u200B',
      'Below you can see all the commands I know\n' +
        this.overlay(
          'To use a command, do `{PREFIX}<Command name> [arguments]\n'
        ) +
        'If you need further help with something join our Support Server.\n\n' +
        '**Have a nice day!**'
    )
    helpEmbed.addField('scripts', commands.join('\n'))

    if (this.args.length > 0) {
      await this.message.channel.send('hi')
    } else {
      await this.message.channel.send(helpEmbed)
    }
  }
}

export default new Help()
