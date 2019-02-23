export const SECONDS_A_MINUTE = 60
export const SECONDS_A_HOUR = SECONDS_A_MINUTE * 60
export const SECONDS_A_DAY = SECONDS_A_HOUR * 24
export const SECONDS_A_WEEK = SECONDS_A_DAY * 7

export const MILLISECONDS_A_SECOND = 1e3
export const MILLISECONDS_A_MINUTE = SECONDS_A_MINUTE * MILLISECONDS_A_SECOND
export const MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND
export const MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND
export const MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND

export const Process = {
  setTitle(title: string) {
    process.title = title
  },

  getTitle() {
    return process.title
  }
}

export const Embed = (type: string) => (
  literal: TemplateStringsArray,
  ...args: any
) =>
  `\`\`\`${type}\n` +
  literal.reduce((l, r, i) => l + (args[i - 1] || '') + r, '') +
  '\n```'

export const Capitalize = (s: string) =>
  s && s.charAt(0).toUpperCase() + s.slice(1)
