/**
 * Asserts if a alleged `error` is a Node.js system error.
 */
export const isErrorNodeSystemError = (error: unknown): error is NodeJS.ErrnoException => {
  return (
    'code' in (error as never) &&
    'errno' in (error as never) &&
    'code' in (error as never) &&
    'syscall' in (error as never)
  )
}

export enum ErrorCode {
  GENERIC = 1000,
  COMMAND_UNKNOWN,
  API_KEY_MISSING,
  API_KEY_INVALID,
  API_RESPONSE_400,
  API_RESPONSE_429,
  API_RESPONSE_500,
  LEAGUE_NOT_FOUND_BY_NAME,
  LEAGUE_NOT_FOUND_BY_CODE,
  TEAM_NOT_FOUND,
  CACHE_WRITE,
  NETWORK_UNREACHABLE,
}

export class ApplicationError extends Error {
  constructor(code: ErrorCode.GENERIC, message: string)
  constructor(code: ErrorCode.COMMAND_UNKNOWN, command: string)
  constructor(code: ErrorCode.API_KEY_MISSING)
  constructor(code: ErrorCode.API_KEY_INVALID)
  constructor(code: ErrorCode.API_RESPONSE_400, message: string)
  constructor(code: ErrorCode.API_RESPONSE_429)
  constructor(code: ErrorCode.API_RESPONSE_500)
  constructor(code: ErrorCode.TEAM_NOT_FOUND, teamName: string)
  constructor(code: ErrorCode.LEAGUE_NOT_FOUND_BY_NAME, leagueName: string)
  constructor(code: ErrorCode.LEAGUE_NOT_FOUND_BY_CODE, leagueCode: string)
  constructor(code: ErrorCode.CACHE_WRITE)
  constructor(code: ErrorCode.NETWORK_UNREACHABLE)
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

    case ErrorCode.API_KEY_INVALID:
      return (
        'The API key set is invalid.\n' +
        'Please check that the SOCCER_GO_API_KEY environment variable matches ' +
        'the key you received upon registration\n\n' +
        '    $ echo $SOCCER_GO_API_KEY\n'
      )

    case ErrorCode.API_RESPONSE_400:
      return `Something went wrong with your request, reason:\n\n    ${extraData}\n`

    case ErrorCode.API_RESPONSE_429:
      return (
        'You seem to have made too many requests.\n' +
        'Please wait a minute before making new requests.\n'
      )

    case ErrorCode.API_RESPONSE_500:
      return 'Cannot retrieve data at this time, please try again later.\n'

    case ErrorCode.LEAGUE_NOT_FOUND_BY_NAME:
      return `Could not find league "${extraData}".\n`

    case ErrorCode.LEAGUE_NOT_FOUND_BY_CODE:
      return `Could not find league with code "${extraData}".\n`

    case ErrorCode.TEAM_NOT_FOUND:
      return `Could not find team "${extraData}".\n`

    case ErrorCode.CACHE_WRITE:
      return `There was an issue when attempting to write data to cache.\n`

    case ErrorCode.NETWORK_UNREACHABLE:
      return 'Could not contact the server.\nPlease check your internet connection.\n'
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
