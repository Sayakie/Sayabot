// @ts-check
// tslint:disable
const net = require('net')

const Client = net.connect({ port: 8107, host: 'localhost' }, () => {
  console.log('Connected')
})
