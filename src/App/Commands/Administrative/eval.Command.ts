import { Command, Group } from '@/App/Structs/Command.Struct'

class Eval extends Command {
  constructor() {
    super()

    this.cmds = 'eval'
    this.description = ''
    this.group = Group.Administrative
    this.hide()
  }

  public async run() {
    const val = this.args.join(' ')

    // tslint:disable:no-eval
    eval(val)
  }
}

export default new Eval()
