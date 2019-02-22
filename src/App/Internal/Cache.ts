import * as net from 'net'

export const cacheManager = net.createServer(Socket => {
  Socket.write('Echo Server\r\n')
  Socket.pipe(Socket)
})
