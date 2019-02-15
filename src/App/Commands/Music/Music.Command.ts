import * as Discord from 'discord.js'
import { Command, Group } from '@/App/Structs/Command.Struct'
import { IPCEvents } from '@/Config/Constants'
import { Console } from '@/Tools'

// const diff = (strings: any, id: string) => `\`\`\`diff\n${id} ${strings}\`\`\``
const diff = (literal: TemplateStringsArray, ...args: any[]) =>
  '```diff\n' +
  literal.reduce((l, r, i) => l + (args[i - 1] || '') + r, '') +
  '```'
// const CONNECTED = diff`+ [✔️] [SHARD_ID]: CONNECTED ~ [GUILD] guilds`
// const DISCONNECTED = diff`- [❌] ${SHARD_ID}: DISCONNECTED`

const commandLog = Console('[Command]')

class Music extends Command {
  constructor() {
    super()

    this.cmds = 'music'
    this.aliases = ['m']
    this.description = ''
    this.group = Group.Administrative
    this.hide()
  }

  public async run() {
    const message = this.instance.receivedData.get('message') as Discord.Message
    process.send(IPCEvents.FETCHGUILD)

    await message.channel.send(diff`${'d'}`).catch(commandLog.error)
  }
}

export default new Music()
