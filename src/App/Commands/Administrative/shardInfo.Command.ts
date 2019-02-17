import * as Discord from 'discord.js'
import { Command, Group } from '@/App/Structs/Command.Struct'
import { Console } from '@/Tools'

// const diff = (strings: any, id: string) => `\`\`\`diff\n${id} ${strings}\`\`\``
const diff = (literal: TemplateStringsArray, ...args: any[]) =>
  '```diff\n' +
  literal.reduce((l, r, i) => l + (args[i - 1] || '') + r, '') +
  '\n```'
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
    // const pool: string[] = []
    const message = this.instance.receivedData.get('message') as Discord.Message

    /*
    const pool = await this.Redis.keysAsync('SHARD_*_GUILD').then(keys =>
      Promise.all(
        keys.forEach(async key =>
          this.Redis.getAsync(key).then(
            numGuilds =>
              `+ [✔️] ${key.replace(
                /\D/g,
                ''
              )}: CONNECTED ~ ${numGuilds} guilds\n`
          )
        )
      )
    )
    */
    const pool = 'hi'

    await message.channel.send(diff`${pool}`).catch(commandLog.error)
  }
}

export default new ShardInfo()
