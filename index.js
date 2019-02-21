// @ts-check
// tslint:disable
const isMatch = (x: any) => ({
  on: () => isMatch(x),
  otherwise: () => x
})

const bindCommand = (x: string) => ({
  on: (pred: any, fn: any): any => (pred(x) ? isMatch(fn(x)) : bindCommand(x)),
  otherwise: (fn: any) => fn(x)
})

bindCommand('sing')
