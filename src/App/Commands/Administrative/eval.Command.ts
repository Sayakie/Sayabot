import { Command, Group } from '@/App/Structs/Command.Struct'
import { Permission } from '@/App/Structs/Permission.Struct'

class Eval extends Command {
  constructor() {
    super()

    this.cmds = 'evaluate'
    this.aliases = ['eval']
    this.description = 'Evaluates the combined factors that received.'
    this.format = '{PREFIX}eval <Element> [...elements]'
    this.group = Group.Administrative
    this.userRequirePermissions = [Permission.Administrator]
    this.botRequirePermissions = [Permission.Administrator]
    this.ownerOnly()
    this.hide()
  }

  public async run() {
    const val = this.args.join(' ')

    // tslint:disable:no-eval
    await eval(val)
  }
}

export default new Eval()
