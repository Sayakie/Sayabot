import * as Redis from 'redis'

export interface RedisClient extends Redis.RedisClient {
  /**
   * Listen for all requests received by the server in real time.
   */
  monitorAsync(): Promise<undefined>

  /**
   * Get information and statistics about the server.
   */
  infoAsync(section?: string | string[]): Promise<Redis.ServerInfo>

  /**
   * Ping the server.
   */
  pingAsync(message?: string): Promise<string>

  /**
   * Post a message to a channel.
   */
  publishAsync(channel: string, value: string): Promise<number>

  /**
   * Authenticate to the server.
   */
  authAsync(password: string): Promise<string>

  /**
   * KILL - Kill the connection of a client.
   * LIST - Get the list of client connections.
   * GETNAME - Get the current connection name.
   * PAUSE - Stop processing commands from clients for some time.
   * REPLY - Instruct the server whether to reply to commands.
   * SETNAME - Set the current connection name.
   */
  // client: OverloadedCommand<string, any, R>;

  /**
   * Set multiple hash fields to multiple values.
   */
  // hmset: OverloadedSetCommand<string | number, 'OK', R>;

  /**
   * Listen for messages published to the given channels.
   */
  // subscribe: OverloadedListCommand<string, string, R>;

  /**
   * Stop listening for messages posted to the given channels.
   */
  // unsubscribe: OverloadedListCommand<string, string, R>;

  /**
   * Listen for messages published to channels matching the given patterns.
   */
  // psubscribe: OverloadedListCommand<string, string, R>;

  /**
   * Stop listening for messages posted to channels matching the given patterns.
   */
  // punsubscribe: OverloadedListCommand<string, string, R>;

  /**
   * Append a value to a key.
   */
  appendAsync(key: string, value: string): Promise<number>
  getAsync?(key: string): Promise<string>
  setAsync?(key: string, values: string): Promise<string>

  getbitAsync?(key: string, offset: number): Promise<number>
  getrangeAsync?(key: string, start: number, end: number): Promise<string>
  getsetAsync?(key: string, value: string): Promise<string>
  hdelAsync?(key: string, fields: string[]): Promise<number>
  hexistsAsync?(key: string, field: string): Promise<number>
  hgetAsync?(key: string, field: string): Promise<string>
  hgetallAsync?(key: string): Promise<{ [key: string]: string }>
  hmgetAsync?(key: string, fields: string[]): Promise<string[]>
  hsetAsync?(key: string, field: string, value: string): Promise<number>
  hsetnxAsync?(key: string, field: string, value: string): Promise<number>
}
