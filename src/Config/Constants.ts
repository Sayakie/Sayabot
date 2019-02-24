type Cluster = number | boolean

const botName = 'Sayabot'
const useCluster = false
const useRedis = false
const Clusters: Cluster = false
const enableDebug = false

const owners = ['247351691077222401']

export const enum IPCEvents {
  EVAL,
  MESSAGE,
  BROADCAST,
  READY,
  SHARDREADY,
  SHARDRECONNECT,
  SHARDRESUMED,
  SHARDISCONNECT,
  FORCE_SHUTDOWN,
  SHUTDOWN,
  RESTARTALL,
  RESTART,
  FETCHUSER,
  FETCHCHANNEL,
  FETCHGUILD
}

export const enum PromptEvents {
  EXIT = 'EXIT'
}

// tslint:disable-next-line:no-var-requires
export const version = require('../../package.json').version

export default { botName, useCluster, useRedis, Clusters, owners, enableDebug }
