/**
 * Asserts if a alleged `error` is a Node.js system error.
 */
export const isErrorNodeSystemError = (error: unknown): error is NodeJS.ErrnoException => {
  return (
    'code' in (error as never) &&
    'errno' in (error as never) &&
    'code' in (error as never) &&
    'path' in (error as never) &&
    'syscall' in (error as never)
  )
}

export enum ErrorCode {
  GENERIC = 1000,
  COMMAND_UNKNOWN,
  API_KEY_MISSING,
}

export class ApplicationError extends Error {
  constructor(code: ErrorCode.GENERIC, message: string)
  constructor(code: ErrorCode.COMMAND_UNKNOWN, command: string)
  constructor(code: ErrorCode.API_KEY_MISSING)
  constructor(public code: ErrorCode, public extraData?: string) {
    super()
  }
}

export const formatErrorForPrinting = (code: ErrorCode, extraData?: string): string => {
  switch (code) {
    case ErrorCode.GENERIC:
      return `Something unexpected happened:\n     ${extraData}\n`

    case ErrorCode.COMMAND_UNKNOWN:
      return `Unknown command "${extraData}".\n`

    case ErrorCode.API_KEY_MISSING:
      return (
        'SOCCER_GO_API_KEY environment variable not set.\n\n' +
        '    $ export SOCCER_GO_API_KEY=<football_data_api_key>\n\n' +
        'You can get your own API key over at\n' +
        'https://www.football-data.org/client/register\n'
      )
  }
}

export const handleCommandError = (error: unknown): void => {
  if (error instanceof ApplicationError) {
    console.error(formatErrorForPrinting(error.code, error.extraData))
    process.exit(error.code)
  }

  if (error instanceof Error) {
    console.error(formatErrorForPrinting(ErrorCode.GENERIC, error.message))
    process.exit(ErrorCode.GENERIC)
  }

  if (typeof error === 'string') {
    console.error(formatErrorForPrinting(ErrorCode.GENERIC, error))
    process.exit(ErrorCode.GENERIC)
  }
}
