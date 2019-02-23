import { Embed } from '@/App/Utils'
import { Command, Group } from '@/App/Structs/Command.Struct'
import { Permission } from '@/App/Structs/Permission.Struct'
import { Console } from '@/Tools'

// const diff = (strings: any, id: string) => `\`\`\`diff\n${id} ${strings}\`\`\``
const diff = Embed('diff')
// const CONNECTED = diff`+ [✔️] [SHARD_ID]: CONNECTED ~ [GUILD] guilds`
// const DISCONNECTED = diff`- [❌] ${SHARD_ID}: DISCONNECTED`

const commandLog = Console('[Command]')

class ShardInfo extends Command {
  constructor() {
    super()

    this.cmds = 'shardinfo'
    this.aliases = ['shards']
    this.description = 'Prints all shards infomation.'
    this.format = '{PREFIX}shardinfo [Shard number]'
    this.group = Group.Administrative
    this.botRequirePermissions = [Permission.SendMessages]
  }

  public async run() {
    // const pool: string[] = []
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

    await this.message.channel.send(diff`${pool}`).catch(commandLog.error)
  }
}

export default new ShardInfo()
