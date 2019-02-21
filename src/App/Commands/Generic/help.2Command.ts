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
// import * as Discord from 'discord.js'
import { Command, Group } from '@/App/Structs/Command.Struct'

class Help extends Command {
  constructor() {
    super()

    this.cmds = 'help'
    this.aliases = ['guide', 'see']
    this.description = ''
    this.group = Group.Generic
  }

  public async run() {
    const result: string[] = []
    if (this.args.length > 0) {
    }
  }
}

export default new Help()
