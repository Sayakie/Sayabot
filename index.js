/* tslint:disable no-console */
//const os = require('os')

//os.setPriority(19)
//console.log(os.getPriority())

// console.log(process.argv)

const getPureArguments = () => {
  const PureArguments = new Map()

  // Remove two factors from argv that never need
  process.argv.splice(0, 2)
  process.argv
    .filter(arg => arg.match(/^-(?!-)/))
    .map(arg => process.argv.splice(process.argv.indexOf(arg, 1), 1))
  process.argv
    .filter(arg => arg.includes('--'))
    .map((_, i) => {
      PureArguments.set(process.argv[i * 2].slice(2), process.argv[++i * 2 - 1])
    })

  return PureArguments
}

const args = getPureArguments()

console.log(args)
