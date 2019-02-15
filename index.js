// @ts-check
// tslint:disable

const Redis = require('redis')
const { promisifyAll } = require('bluebird')
const Client = Redis.createClient()

promisifyAll(Redis.RedisClient.prototype)
promisifyAll(Redis.Multi.prototype)

let str = 'z\n'

const asyncBlock = async () => {
  await Client.setAsync('SHARD_0_GUILD', 2500)
  await Client.setAsync('SHARD_1_GUILD', 2498)
  await Client.setAsync('SHARD_2_GUILD', 2506)
  await Client.setAsync('SHARD_3_GUILD', 2502)
  await Client.keysAsync('SHARD_*_GUILD').then(keys =>
    keys.forEach(key => {
      Client.getAsync(key).then(
        numGuilds =>
          (str += `+ [✔️] ${key.replace(
            /\D/g,
            ''
          )}: CONNECTED ~ ${numGuilds} guilds\n`)
      )
    })
  )
}

asyncBlock().then(() => console.log(str))
