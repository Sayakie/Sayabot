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

class ShardInfo extends Command {
  constructor() {
    super()

    this.cmds = 'shardinfo'
    this.aliases = ['shards']
    this.description = ''
    this.group = Group.Administrative
    this.hide()
  }

  public async run() {
    let str = ''
    const message = this.instance.receivedData.get('message') as Discord.Message
    process.send(IPCEvents.FETCHGUILD)

    // prettier-ignore
    this.Client.keys('SHARD_*_GUILD', (err, keys) => {
      if (err) {
        console.error(err)
      } else {
        keys.map(key => {
          this.Client.get(key, (err2, numGuilds) => {
            if (err2) {
              console.error(err)
            } else {
              str += `+ [✔️] ${key.replace(/\D/g, '')}: CONNECTED ~ ${numGuilds} guilds\n`
            }
          })
        })
      }
    })

    await message.channel.send(diff`${str}`).catch(commandLog.error)
  }
}

export default new ShardInfo()
