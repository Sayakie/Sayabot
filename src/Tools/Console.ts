import chalk from 'chalk'
import * as dayjs from 'dayjs'
import { inspect } from 'util'

// import { argv } from '@/App'
// import C from '@/Config/Constants'

const inspectOptions: NodeJS.InspectOptions = {
  colors: true,
  depth: null
}

const enum TYPE {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERR!',
  DEBUG = 'DEBUG'
}

class Console {
  private static readonly out = (
    consoleType: string,
    atPoint: string,
    message?: any,
    ...optionalParams: any[]
  ) => {
    if (!message) {
      console.log()
      return
    }

    const consoleDate = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
    // const memoryDate = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS')
    const processUptime = process.uptime().toFixed(3)
    const processID = process.pid

    console.log(
      consoleDate,
      processUptime,
      processID,
      consoleType,
      atPoint,
      typeof message === 'object' ? inspect(message, inspectOptions) : message,
      ...optionalParams
    )
  }

  public static readonly info = (
    atPoint: string,
    message?: any,
    ...optionalParams: any[]
  ) => Console.out(chalk.green(TYPE.INFO), atPoint, message, ...optionalParams)
  public static readonly warn = (
    atPoint: string,
    message?: any,
    ...optionalParams: any[]
  ) => Console.out(chalk.yellow(TYPE.WARN), atPoint, message, ...optionalParams)
  public static readonly error = (
    atPoint: string,
    message?: any,
    ...optionalParams: any[]
  ) => Console.out(chalk.red(TYPE.ERROR), atPoint, message, ...optionalParams)
  public static readonly debug = (
    atPoint: string,
    message?: any,
    ...optionalParams: any[]
  ) => Console.out(chalk.blue(TYPE.DEBUG), atPoint, message, ...optionalParams)

  public static readonly log = Console.info
}

export const ConsoleBuilder = (prefix: string) => ({
  log(message?: any, ...optionalParams: any[]) {
    Console.log(chalk.yellow(prefix), message, ...optionalParams)
  },
  info(message?: any, ...optionalParams: any[]) {
    Console.info(chalk.yellow(prefix), message, ...optionalParams)
  },
  warn(message?: any, ...optionalParams: any[]) {
    Console.warn(chalk.yellow(prefix), message, ...optionalParams)
  },
  error(message?: any, ...optionalParams: any[]) {
    Console.error(chalk.yellow(prefix), message, ...optionalParams)
  },
  debug(message?: any, ...optionalParams: any[]) {
    Console.debug(chalk.yellow(prefix), message, ...optionalParams)
  }
})
