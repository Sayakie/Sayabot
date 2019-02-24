import * as fs from 'fs'
import { join } from 'path'

import { Instance } from '@/App/Structs/Shard.Struct'
import { Command, Group } from '@/App/Structs/Command.Struct'
import { Permission } from '@/App/Structs/Permission.Struct'

class Music extends Command {
  private subcommands = new Map<string, Command>()
  constructor() {
    super()

    this.cmds = 'music'
    this.aliases = ['m']
    this.description = 'Play a music from Youtube'
    this.format = '{PREFIX}music <subcommand>'
    this.group = Group.Generic
    //this.userRequirePermissions = [Permission.Administrator]
    this.botRequirePermissions = [Permission.Connect, Permission.Speak]
  }

  public initialise(instance: Instance) {
    super.initialise(instance)

    const subcommandFiles = fs
      .readdirSync(__dirname)
      .map(file => join(__dirname, file))
      .filter(
        file =>
          file.includes('.Music') &&
          (file.endsWith('ts') || file.endsWith('js'))
      )

    subcommandFiles.forEach(file => {
      const subcommandPack = require(file).default as Command

      subcommandPack.initialise(instance)
      subcommandPack.aliases.unshift(subcommandPack.cmds)
      subcommandPack.aliases.forEach(cmd => {
        this.subcommands.set(cmd, subcommandPack)
      })
    })
  }

  public async run() {
    const subcommand = this.args[0]
    if (this.subcommands.has(subcommand)) {
      await this.subcommands
        .get(subcommand)
        .inject(this.message, this.args)
        .inspect()
        .run()
    } else {
      await this.message.channel.send(
        'There is no applicable commands. Type {PREFIX}help music'
      )
    }
  }
}

export default new Music()
