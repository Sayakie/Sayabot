import { Command, Group } from '@/App/Structs/Command.Struct'
import { Permission } from '@/App/Structs/Permission.Struct'

class Eval extends Command {
  constructor() {
    super()

    this.cmds = 'eval'
    this.description = ''
    this.group = Group.Administrative
    this.botRequirePermissions = [Permission.Administrator]
    this.hide()
  }

  public async run() {
    const val = this.args.join(' ')

    // tslint:disable:no-eval
    eval(val)
  }
}

export default new Eval()
