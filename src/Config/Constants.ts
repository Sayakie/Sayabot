type Cluster = number | boolean

const botName = 'Sayabot'
const useCluster = false
const useRedis = false
const Clusters: Cluster = false

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

export default { botName, useCluster, useRedis, Clusters }
