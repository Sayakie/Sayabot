// @ts-check
// tslint:disable

// const Console = require('./dist/Tools')
const Cluster = require('cluster')
const numClusters = require('os').cpus() /*
const IPC = require('node-ipc')

process.env.HOST = '127.0.0.1'
process.env.PORT = '1773'

const { HOST, PORT } = process.env
// IPC.config.logger = testLog.log.bind(testLog)
IPC.config.retry = 1500

const ServerListener = () => {
  IPC.server.on('message', (data, socket) => {
    IPC.log(`Got a message: ${data}`)
    IPC.server.emit(socket, 'message', +data)
  })

  IPC.server.on('socket.disconnected', (socket, destroyedSocketID) => {
    IPC.log(`Client ${destroyedSocketID} has disconnected!`)
  })
}

const ClientListner = () => {
  IPC.of.Master.on('connect', () => {
    IPC.log(`## Connected to Master IPC ## ... Took ${IPC.config.delay} ms`)
  })

  IPC.of.Master.on('disconnect', () => {
    IPC.log('Disconnected from the Master IPC')
  })

  IPC.of.Master.on('message', data => {
    IPC.log(`Got a message from Master: ${data}`)
  })
}
*/
if (Cluster.isMaster) {
  //IPC.config.id = 'Master'
  //IPC.serveNet(HOST, PORT, ServerListener)
  //IPC.server.start()

  let numCluster = 0
  numClusters.forEach(() => {
    const clusterEnv = {
      SHARD_ID: numCluster++,
      SHARD_COUNT: numClusters.length
    }
    Cluster.fork(clusterEnv)
  })
  /*
  for (let clusterID = 0; clusterID < numClusters; clusterID++) {
    const clusterEnv = { SHARD_ID: clusterID, SHARD_COUNT: numClusters }

    Cluster.fork(clusterEnv)
  }
  */
} else {
  console.log(process.env.SHARD_ID, process.env.SHARD_COUNT)
  process.exit(0)
  //IPC.config.id = `Cluster_${process.env.SHARD_ID}`
  //IPC.connectToNet('Master', ClientListner)
}
