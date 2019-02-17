// @ts-check
// tslint:disable

const forwardMessage = d => {
  console.log(JSON.stringify({ type: 'msg', d }))
}

;(state => {
  forwardMessage({ action: 'updateState', d: { state } })
})('init')

/*
const Redis = require('redis')
const { promisify } = require('util')
const { promisifyAll } = require('bluebird')
const Client = Redis.createClient()
const diff = (literal, ...args) =>
  '```diff\n' +
  literal.reduce((l, r, i) => l + (args[i - 1] || '') + r, '') +
  '\n```'

promisifyAll(Redis.RedisClient.prototype)
promisifyAll(Redis.Multi.prototype)

let str = []
let a = ''

const asyncBlock = async () => {
  await Client.setAsync('SHARD_0_GUILD', 2500)
  await Client.setAsync('SHARD_1_GUILD', 2498)
  await Client.setAsync('SHARD_2_GUILD', 2506)
  await Client.setAsync('SHARD_3_GUILD', 2502)
  await Client.
  await Client.keysAsync('SHARD_*_GUILD').then(keys => {
    keys.forEach(key => {
      Client.getAsync(key).then(numGuilds =>
        str.push(
          `+ [✔️] ${key.replace(/\D/g, '')}: CONNECTED ~ ${numGuilds} guilds`
        )
      )
    })
  })
}

asyncBlock()
*/
