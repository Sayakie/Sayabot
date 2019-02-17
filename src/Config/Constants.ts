type Cluster = number | boolean

const botName = 'Sayabot'
const useCluster = false
const useRedis = false
const Clusters: Cluster = false

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

export default { botName, useCluster, useRedis, Clusters, owners }
