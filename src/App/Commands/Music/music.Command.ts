import * as fs from 'fs'

import { Instance } from '@/App/Structs/Shard.Struct'
import { Command, Group } from '@/App/Structs/Command.Struct'
import { Permission } from '@/App/Structs/Permission.Struct'

class Music extends Command {
  private subcommands = new Map<string, any>()
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
    this.instance = instance
    this.format = this.overlay(this.format)

    const subcommandFiles = fs
      .readdirSync(__dirname)
      .map(file => `${__dirname}\\${file}`)
      .filter(
        file =>
          file.includes('.Music') &&
          (file.endsWith('ts') || file.endsWith('js'))
      )

    subcommandFiles.forEach(file => {
      const subcommandName = file.split(`${__dirname}\\`)[1].split('.')[0]
      const subcommandPack = require(file).default

      this.subcommands.set(subcommandName, subcommandPack)
    })
  }

  public async run() {
    if (this.subcommands.has(this.args[0])) {
      await this.subcommands.get(this.args[0])(this.message)
    } else {
      await this.message.channel.send(
        'There is no applicable commands. Type {PREFIX}help music'
      )
    }
  }
}

export default new Music()
