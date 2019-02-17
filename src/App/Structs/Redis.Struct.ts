import * as Redis from 'redis'

export interface RedisClient extends Redis.RedisClient {
  /**
   * Listen for all requests received by the server in real time.
   */
  monitorAsync?(): Promise<undefined>

  /**
   * Get information and statistics about the server.
   */
  infoAsync?(section?: string | string[]): Promise<Redis.ServerInfo>

  /**
   * Ping the server.
   */
  pingAsync?(message?: string): Promise<string>

  /**
   * Post a message to a channel.
   */
  publishAsync?(channel: string, value: string): Promise<number>

  /**
   * Authenticate to the server.
   */
  authAsync?(password: string): Promise<string>

  /**
   * KILL - Kill the connection of a client.
   * LIST - Get the list of client connections.
   * GETNAME - Get the current connection name.
   * PAUSE - Stop processing commands from clients for some time.
   * REPLY - Instruct the server whether to reply to commands.
   * SETNAME - Set the current connection name.
   */
  // client?: OverloadedCommand<string, any, R>

  /**
   * Set multiple hash fields to multiple values.
   */
  // hmset?: OverloadedSetCommand<string | number, 'OK', R>

  /**
   * Listen for messages published to the given channels.
   */
  // subscribe?: OverloadedListCommand<string, string, R>

  /**
   * Stop listening for messages posted to the given channels.
   */
  // unsubscribe?: OverloadedListCommand<string, string, R>

  /**
   * Listen for messages published to channels matching the given patterns.
   */
  // psubscribe?: OverloadedListCommand<string, string, R>

  /**
   * Stop listening for messages posted to channels matching the given patterns.
   */
  // punsubscribe?: OverloadedListCommand<string, string, R>

  /**
   * Append a value to a key.
   */
  appendAsync?(key: string, value: string): Promise<number>

  /**
   * Asynchronously rewrite the append-only file.
   */
  // bgrewriteaof?(cb?: Callback<'OK'>): R

  /**
   * Asynchronously save the dataset to disk.
   */
  // bgsave?(cb?: Callback<string>): R

  /**
   * Count set bits in a string.
   */
  bitcountAsync?(key: string, start?: number, end?: number): Promise<number>

  /**
   * Perform arbitrary bitfield integer operations on strings.
   */
  // bitfield?: OverloadedKeyCommand<string | number, [number, number], R>

  /**
   * Perform bitwise operations between strings.
   */
  bitopAsync?(
    operation: string,
    destkey: string,
    ...args: Array<string | number>
  ): Promise<number>

  /**
   * Find first bit set or clear in a string.
   */
  bitposAsync?(
    key: string,
    bit: number,
    start?: number,
    end?: number
  ): Promise<number>

  /**
   * Remove and get the first element in a list, or block until one is available.
   */
  // blpop?: OverloadedLastCommand<string, number, [string, string], R>

  /**
   * Remove and get the last element in a list, or block until one is available.
   */
  // brpop?: OverloadedLastCommand<string, number, [string, string], R>

  /**
   * Pop a value from a list, push it to another list and return it; or block until one is available.
   */
  brpoplpushAsync?(
    source: string,
    destination: string,
    timeout: number
  ): Promise<string | null>

  /**
   * ADDSLOTS - Assign new hash slots to receiving node.
   * COUNT-FAILURE-REPORTS - Return the number of failure reports active for a given node.
   * COUNTKEYSINSLOT - Return the number of local keys in the specified hash slot.
   * DELSLOTS - Set hash slots as unbound in receiving node.
   * FAILOVER - Forces a slave to perform a manual failover of its master.
   * FORGET - Remove a node from the nodes table.
   * GETKEYSINSLOT - Return local key names in the specified hash slot.
   * INFO - Provides info about Redis Cluster node state.
   * KEYSLOT - Returns the hash slot of the specified key.
   * MEET - Force a node cluster to handshake with another node.
   * NODES - Get cluster config for the node.
   * REPLICATE - Reconfigure a node as a slave of the specified master node.
   * RESET - Reset a Redis Cluster node.
   * SAVECONFIG - Forces the node to save cluster state on disk.
   * SET-CONFIG-EPOCH - Set the configuration epoch in a new node.
   * SETSLOT - Bind a hash slot to a specified node.
   * SLAVES - List slave nodes of the specified master node.
   * SLOTS - Get array of Cluster slot to node mappings.
   */
  // cluster: OverloadedCommand<string, any, this>

  /**
   * Get array of Redis command details.
   *
   * COUNT - Get total number of Redis commands.
   * GETKEYS - Extract keys given a full Redis command.
   * INFO - Get array of specific REdis command details.
   */
  commandAsync?(): Promise<
    Array<[string, number, string[], number, number, number]>
  >

  /**
   * Get array of Redis command details.
   *
   * COUNT - Get array of Redis command details.
   * GETKEYS - Extract keys given a full Redis command.
   * INFO - Get array of specific Redis command details.
   * GET - Get the value of a configuration parameter.
   * REWRITE - Rewrite the configuration file with the in memory configuration.
   * SET - Set a configuration parameter to the given value.
   * RESETSTAT - Reset the stats returned by INFO.
   */
  // config: OverloadedCommand<string, boolean, R>

  /**
   * Return the number of keys in the selected database.
   */
  dbsizeAsync?(): Promise<number>

  /**
   * OBJECT - Get debugging information about a key.
   * SEGFAULT - Make the server crash.
   */
  // debug: OverloadedCommand<string, boolean, R>

  /**
   * Decrement the integer value of a key by one.
   */
  decrAsync?(key: string): Promise<number>

  /**
   * Decrement the integer value of a key by the given number.
   */
  desrbyAsync?(key: string, decrement: number): Promise<number>

  /**
   * Delete a key.
   */
  // del: OverloadedCommand<string, number, R>

  /**
   * Discard all commands issued after MULTI.
   */
  discardAsync?(): Promise<'OK'>

  /**
   * Return a serialized version of the value stored at the specified key.
   */
  dumpAsync?(key: string): Promise<string>

  /**
   * Echo the given string.
   */
  echoAsync?<T extends string>(message: T): Promise<T>

  /**
   * Execute a Lua script server side.
   */
  // eval: OverloadedCommand<string | number, any, R>

  /**
   * Execute a Lue script server side.
   */
  // evalsha: OverloadedCommand<string | number, any, R>

  /**
   * Determine if a key exists.
   */
  // exists: OverloadedCommand<string, number, R>

  /**
   * Set a key's time to live in seconds.
   */
  expireAsync?(key: string, seconds: number): Promise<number>

  /**
   * Set the expiration for a key as a UNIX timestamp.
   */
  expireatAsync?(key: string, timestamp: number): Promise<number>

  /**
   * Remove all keys from all databases.
   */
  flushallAsync?(): Promise<string>

  /**
   * Remove all keys from the current database.
   */
  flushdbAsync?(): Promise<'OK'>

  /**
   * Add one or more geospatial items in the geospatial index represented using a sorted set.
   */
  // geoadd: OverloadedKeyCommand<string | number, number, R>

  /**
   * Returns members of a geospatial index as standard geohash strings.
   */
  // geohash: OverloadedKeyCommand<string, string, R>

  /**
   * Returns longitude and latitude of members of a geospatial index.
   */
  // geopos: OverloadedKeyCommand<string, Array<[number, number]>, R>

  /**
   * Returns the distance between two members of a geospatial index.
   */
  // geodist: OverloadedKeyCommand<string, string, R>

  /**
   * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point.
   */
  // georadius: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>

  /**
   * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member.
   */
  // georadiusbymember: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>

  /**
   * Get the value of a key.
   */
  getAsync?(key: string): Promise<string>

  /**
   * Returns the bit value at offset in the string value stored at key.
   */
  getbitAsync?(key: string, offset: number): Promise<number>

  /**
   * Get a substring of the string stored at a key.
   */
  getrangeAsync?(key: string, start: number, end: number): Promise<string>

  /**
   * Set the string value of a key and return its old value.
   */
  getsetAsync?(key: string, value: string): Promise<string>

  /**
   * Delete on or more hash fields.
   */
  hdelAsync?(key: string, fields: string[]): Promise<number>

  /**
   * Determine if a hash field exists.
   */
  hexistsAsync?(key: string, field: string): Promise<number>

  /**
   * Get the value of a hash field.
   */
  hgetAsync?(key: string, field: string): Promise<string>

  /**
   * Get all fields and values in a hash.
   */
  hgetallAsync?(key: string): Promise<{ [key: string]: string }>

  /**
   * Increment the integer value of a hash field by the given number.
   */
  hincrbyAsync?(key: string, field: string, increment: number): Promise<number>

  /**
   * Increment the float value of a hash field by the given amount.
   */
  hincrbyfloatAsync?(
    key: string,
    field: string,
    increment: number
  ): Promise<string>

  /**
   * Get all the fields of a hash.
   */
  hkeysAsync?(key: string): Promise<string[]>

  /**
   * Get the number of fields in a hash.
   */
  hlenAsync?(key: string): Promise<number>

  /**
   * Get the values of all the given hash fields.
   */
  hmgetAsync?(key: string, fields: string[]): Promise<string[]>

  /**
   * Set the string value of a hash field.
   */
  hsetAsync?(key: string, field: string, value: string): Promise<number>

  /**
   * Set the value of a hash field, only if the field does not exist.
   */
  hsetnxAsync?(key: string, field: string, value: string): Promise<number>

  /**
   * Get the length of the value of a hash field.
   */
  hstrlenAsync?(key: string, field: string): Promise<number>

  /**
   * Get all the values of a hash.
   */
  hvalsAsync?(key: string): Promise<string[]>

  /**
   * Increment the integer value of a key by one.
   */
  incrAsync?(key: string): Promise<number>

  /**
   * Increment the integer value of a key by the given amount.
   */
  incrbyAsync?(key: string, increment: number): Promise<number>

  /**
   * Increment the float value of a key by the given amount.
   */
  incrbyfloatAsync?(key: string, increment: number): Promise<string>

  /**
   * Find all keys matching the given pattern.
   */
  keysAsync?(pattern: string): Promise<string[]>

  /**
   * Get the UNIX time stamp of the last successful save to disk.
   */
  lastsaveAsync?(): Promise<number>

  /**
   * Get an element from a list by its index.
   */
  lindexAsync?(key: string, index: number): Promise<string>

  /**
   * Insert an element before or after another element in a list.
   */
  linsertAsync?(
    key: string,
    dir: 'BEFORE' | 'AFTER',
    pivot: string,
    value: string
  ): Promise<string>

  /**
   * Get the length of a list.
   */
  llenAsync?(key: string): Promise<number>

  /**
   * Remove and get the first element in a list.
   */
  lpopAsync?(key: string): Promise<string>

  /**
   * Prepend a value to a list, only if the list exists.
   */
  lpushxAsync?(key: string, value: string): Promise<number>

  /**
   * Get a range of elements from a list.
   */
  lrangeAsync?(key: string, start: number, stop: number): Promise<string[]>

  /**
   * Remove elements from a list.
   */
  lremAsync?(key: string, count: number, value: string): Promise<number>

  /**
   * Set the value of an element in a list by its index.
   */
  lsetAsync?(key: string, index: number): Promise<'OK'>

  /**
   * Trim a list to the specified range.
   */
  ltrimAsync?(key: string, start: number, stop: number): Promise<'OK'>

  /**
   * Get the values of all given keys.
   */
  // mget: OverloadedCommand<string, string[], R>

  /**
   * Atomically tranfer a key from a Redis instance to another one.
   */
  // migrate: OverloadedCommand<string, boolean, R>

  /**
   * Move a key to another database.
   */
  moveAsync?(key: string, db: string | number): Promise<string>

  /**
   * Set multiple keys to multiple values.
   */
  // mset: OverloadedCommand<string, boolean, R>

  /**
   * Set multiple keys to multiple values, only if none of the keys exist.
   */
  // msetnx: OverloadedCommand<string, boolean, R>

  /**
   * Inspect the internals of Redis objects.
   */
  // object: OverloadedCommand<string, any, R>

  /**
   * Remove the expiration from a key.
   */
  persistAsync?(key: string): Promise<number>

  /**
   * Remove a key's time to live in milliseconds.
   */
  pexpireAsync?(key: string, milliseconds: number): Promise<number>

  /**
   * Set the expiration for a key as a UNIX timestamp specified in milliseconds.
   */
  pexpireatAsync?(key: string, millisecondsTimestamp: number): Promise<number>

  /**
   * Adds the specified elements to the specified HyperLogLog.
   */
  // pfadd: OverloadedKeyCommand<string, number, R>

  /**
   * Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).
   */
  // pfcount: OverloadedCommand<string, number, R>

  /**
   * Merge N different HyperLogLogs into a single one.
   */
  // pfmerge: OverloadedCommand<string, boolean, R>

  /**
   * Set the value and expiration in milliseconds of a key.
   */
  psetexAsync?(key: string, milliseconds: number, value: string): Promise<'OK'>

  /**
   * Inspect the state of the Pub/Sub subsytem.
   */
  // pubsub: OverloadedCommand<string, number, R>

  /**
   * Get the time to live for a key in milliseconds.
   */
  pttlAsync?(key: string): Promise<number>

  /**
   * Close the connection.
   */
  quitAsync?(): Promise<'OK'>

  /**
   * Return a random key from the keyspace.
   */
  randomkeyAsync?(): Promise<string>

  /**
   * Enables read queries for a connection to a cluster slave node.
   */
  readonlyAsync?(): Promise<string>

  /**
   * Disables read queries for a connection to cluster slave node.
   */
  readwriteAsync?(): Promise<string>

  /**
   * Rename a key.
   */
  renameAsync?(key: string, newKey: string): Promise<'OK'>

  /**
   * Rename a key, only if the new key does not exist.
   */
  renamenxAsync?(key: string, newKey: string): Promise<number>

  /**
   * Create a key using the provided serialized value, previously obtained using DUMP.
   */
  restoreAsync?(
    key: string,
    ttl: number,
    serializedValue: string
  ): Promise<'OK'>

  /**
   * Return the role of the instance in the context of replication.
   */
  roleAsync?(): Promise<[string, number, Array<[string, string, string]>]>

  /**
   * Remove and get the last element in a list.
   */
  rpopAsync?(key: string): Promise<string>

  setAsync?(key: string, values: string): Promise<string>
}
