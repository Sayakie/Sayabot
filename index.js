// @ts-check
// tslint:disable

const Redis = require('redis')
const Client = Redis.createClient()const diff = (literal, ...args) =>
  '```diff\n' +
  literal.reduce((l, r, i) => l + (args[i - 1] || '') + r, '') +
  '```'

var str = ''
Client.set('SHARD_0_GUILD', 2504)
Client.set('SHARD_1_GUILD', 2500)
Client.set('SHARD_2_GUILD', 2499)
Client.set('SHARD_3_GUILD', 2507)

Client.keys('SHARD_*_GUILD', (err, keys) => {
  if (err) {
    console.error('asdasdsad' + err)
  } else {
    keys.map(key => {
      Client.get(key, (err2, numGuilds) => {
        if (err2) {
          console.error('zz' + err)
        } else {
          // prettier-ignore
          str += `+ [✔️] ${key.replace(/\D/g, '')}: CONNECTED ~ ${numGuilds} guilds\n`
        }
      })
    })
  }
})
/*
const str = `+ [✔️] 0: CONNECTED ~ 2504 guilds\n+ [✔️] 1: CONNECTED ~ 2500 guilds\n+ [✔️] 2: CONNECTED ~ 2499 guilds\n+ [✔️] 3: CONNECTED ~ 2507 guilds\n`*/

console.log(diff`${str}`)
setInterval(() => console.log(diff`${str}`), 1000)
