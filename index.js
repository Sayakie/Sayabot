// @ts-check
// tslint:disable

const EventEmitter = require('events').EventEmitter

class Test extends EventEmitter {
  constructor() {
    super()

    this.on('debug', this.debug)
    this.emit('debug', '[ws] test')
  }

  debug(...log) {
    console.log(log)
  }
}

new Test()
const d = require('./test').default

d
