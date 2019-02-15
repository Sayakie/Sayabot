import { promisifyAll } from 'bluebird'
import * as Redis from 'redis'

import * as db from '@/Config/DBConfig.json'

const client = Redis.createClient({
  port: db.RedisDBPort,
  host: db.RedisDBHort
})
