//import C from '@/Config/Constants'
//import { argv } from '@/App'
import { Shard } from '@/App/Shard'
import { Console } from '@/Tools'

const shardLog = Console('[Shard]')

export class ClientManager {
  private client: Shard

  constructor(client: Shard) {
    this.client = client
  }

  public register() {
    this.client.on('debug', this.debug)
  }

  private debug(log: string, ...logs: string[]) {
    //if (argv.has('enable-debug') || C.enableDebug) {
    shardLog.debug(log, ...logs)
    //}
  }
}
