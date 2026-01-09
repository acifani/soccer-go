import {
  isErrorNodeSystemError,
  ErrorCode,
  ApplicationError,
  formatErrorForPrinting,
  handleCommandError,
} from './errors'

describe('isErrorNodeSystemError', () => {
  it('should return true for Node.js system error', () => {
    const error: NodeJS.ErrnoException = {
      name: 'Error',
      message: 'ENOENT: no such file or directory',
      code: 'ENOENT',
      errno: -2,
      syscall: 'open',
    }

    expect(isErrorNodeSystemError(error)).toBe(true)
  })

  it('should return false for generic Error', () => {
    const error = new Error('Generic error')

    expect(isErrorNodeSystemError(error)).toBe(false)
  })

  it('should throw TypeError for string (current behavior)', () => {
    expect(() => isErrorNodeSystemError('error string')).toThrow(TypeError)
  })

  it('should throw TypeError for null (current behavior)', () => {
    expect(() => isErrorNodeSystemError(null)).toThrow(TypeError)
  })

  it('should return false for object missing system error properties', () => {
    const error = { code: 'SOME_CODE', message: 'Some message' }

    expect(isErrorNodeSystemError(error)).toBe(false)
  })
})

describe('ApplicationError', () => {
  it('should construct with GENERIC error code and message', () => {
    const error = new ApplicationError(ErrorCode.GENERIC, 'Something went wrong')

    expect(error.code).toBe(ErrorCode.GENERIC)
    expect(error.extraData).toBe('Something went wrong')
  })

  it('should construct with COMMAND_UNKNOWN error code', () => {
    const error = new ApplicationError(ErrorCode.COMMAND_UNKNOWN, 'badcommand')

    expect(error.code).toBe(ErrorCode.COMMAND_UNKNOWN)
    expect(error.extraData).toBe('badcommand')
  })

  it('should construct with API_KEY_MISSING error code', () => {
    const error = new ApplicationError(ErrorCode.API_KEY_MISSING)

    expect(error.code).toBe(ErrorCode.API_KEY_MISSING)
    expect(error.extraData).toBeUndefined()
  })

  it('should construct with API_KEY_INVALID error code', () => {
    const error = new ApplicationError(ErrorCode.API_KEY_INVALID)

    expect(error.code).toBe(ErrorCode.API_KEY_INVALID)
    expect(error.extraData).toBeUndefined()
  })

  it('should construct with API_RESPONSE_400 error code', () => {
    const error = new ApplicationError(ErrorCode.API_RESPONSE_400, 'Bad request reason')

    expect(error.code).toBe(ErrorCode.API_RESPONSE_400)
    expect(error.extraData).toBe('Bad request reason')
  })

  it('should construct with API_RESPONSE_429 error code', () => {
    const error = new ApplicationError(ErrorCode.API_RESPONSE_429)

    expect(error.code).toBe(ErrorCode.API_RESPONSE_429)
    expect(error.extraData).toBeUndefined()
  })

  it('should construct with API_RESPONSE_500 error code', () => {
    const error = new ApplicationError(ErrorCode.API_RESPONSE_500)

    expect(error.code).toBe(ErrorCode.API_RESPONSE_500)
    expect(error.extraData).toBeUndefined()
  })

  it('should construct with TEAM_NOT_FOUND error code', () => {
    const error = new ApplicationError(ErrorCode.TEAM_NOT_FOUND, 'Liverpool')

    expect(error.code).toBe(ErrorCode.TEAM_NOT_FOUND)
    expect(error.extraData).toBe('Liverpool')
  })

  it('should construct with LEAGUE_NOT_FOUND_BY_NAME error code', () => {
    const error = new ApplicationError(ErrorCode.LEAGUE_NOT_FOUND_BY_NAME, 'Bundesliga')

    expect(error.code).toBe(ErrorCode.LEAGUE_NOT_FOUND_BY_NAME)
    expect(error.extraData).toBe('Bundesliga')
  })

  it('should construct with LEAGUE_NOT_FOUND_BY_CODE error code', () => {
    const error = new ApplicationError(ErrorCode.LEAGUE_NOT_FOUND_BY_CODE, 'XYZ')

    expect(error.code).toBe(ErrorCode.LEAGUE_NOT_FOUND_BY_CODE)
    expect(error.extraData).toBe('XYZ')
  })

  it('should construct with NETWORK_UNREACHABLE error code', () => {
    const error = new ApplicationError(ErrorCode.NETWORK_UNREACHABLE)

    expect(error.code).toBe(ErrorCode.NETWORK_UNREACHABLE)
    expect(error.extraData).toBeUndefined()
  })

  it('should be instance of Error', () => {
    const error = new ApplicationError(ErrorCode.GENERIC, 'test')

    expect(error).toBeInstanceOf(Error)
  })
})

describe('formatErrorForPrinting', () => {
  it('should format GENERIC error with extra data', () => {
    const result = formatErrorForPrinting(ErrorCode.GENERIC, 'File not found')

    expect(result).toContain('Something unexpected happened')
    expect(result).toContain('File not found')
  })

  it('should format COMMAND_UNKNOWN error', () => {
    const result = formatErrorForPrinting(ErrorCode.COMMAND_UNKNOWN, 'badcmd')

    expect(result).toContain('Unknown command "badcmd"')
  })

  it('should format API_KEY_MISSING error with setup instructions', () => {
    const result = formatErrorForPrinting(ErrorCode.API_KEY_MISSING)

    expect(result).toContain('SOCCER_GO_API_KEY environment variable not set')
    expect(result).toContain('export SOCCER_GO_API_KEY')
    expect(result).toContain('https://www.football-data.org/client/register')
  })

  it('should format API_KEY_INVALID error with verification instructions', () => {
    const result = formatErrorForPrinting(ErrorCode.API_KEY_INVALID)

    expect(result).toContain('API key set is invalid')
    expect(result).toContain('echo $SOCCER_GO_API_KEY')
  })

  it('should format API_RESPONSE_400 error with reason', () => {
    const result = formatErrorForPrinting(ErrorCode.API_RESPONSE_400, 'Invalid league code')

    expect(result).toContain('Something went wrong with your request')
    expect(result).toContain('Invalid league code')
  })

  it('should format API_RESPONSE_429 error', () => {
    const result = formatErrorForPrinting(ErrorCode.API_RESPONSE_429)

    expect(result).toContain('too many requests')
    expect(result).toContain('wait a minute')
  })

  it('should format API_RESPONSE_500 error', () => {
    const result = formatErrorForPrinting(ErrorCode.API_RESPONSE_500)

    expect(result).toContain('Cannot retrieve data at this time')
    expect(result).toContain('try again later')
  })

  it('should format LEAGUE_NOT_FOUND_BY_NAME error', () => {
    const result = formatErrorForPrinting(ErrorCode.LEAGUE_NOT_FOUND_BY_NAME, 'Serie A')

    expect(result).toContain('Could not find league "Serie A"')
  })

  it('should format LEAGUE_NOT_FOUND_BY_CODE error', () => {
    const result = formatErrorForPrinting(ErrorCode.LEAGUE_NOT_FOUND_BY_CODE, 'ABC')

    expect(result).toContain('Could not find league with code "ABC"')
  })

  it('should format TEAM_NOT_FOUND error', () => {
    const result = formatErrorForPrinting(ErrorCode.TEAM_NOT_FOUND, 'Manchester City')

    expect(result).toContain('Could not find team "Manchester City"')
  })

  it('should format NETWORK_UNREACHABLE error', () => {
    const result = formatErrorForPrinting(ErrorCode.NETWORK_UNREACHABLE)

    expect(result).toContain('Could not contact the server')
    expect(result).toContain('check your internet connection')
  })
})

describe('handleCommandError', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called')
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should handle ApplicationError with API_KEY_MISSING', () => {
    const error = new ApplicationError(ErrorCode.API_KEY_MISSING)

    expect(() => handleCommandError(error)).toThrow('process.exit called')
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('SOCCER_GO_API_KEY'))
    expect(process.exit).toHaveBeenCalledWith(ErrorCode.API_KEY_MISSING)
  })

  it('should handle ApplicationError with TEAM_NOT_FOUND', () => {
    const error = new ApplicationError(ErrorCode.TEAM_NOT_FOUND, 'Arsenal')

    expect(() => handleCommandError(error)).toThrow('process.exit called')
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Arsenal'))
    expect(process.exit).toHaveBeenCalledWith(ErrorCode.TEAM_NOT_FOUND)
  })

  it('should handle ApplicationError with API_RESPONSE_429', () => {
    const error = new ApplicationError(ErrorCode.API_RESPONSE_429)

    expect(() => handleCommandError(error)).toThrow('process.exit called')
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('too many requests'))
    expect(process.exit).toHaveBeenCalledWith(ErrorCode.API_RESPONSE_429)
  })

  it('should handle ApplicationError with NETWORK_UNREACHABLE', () => {
    const error = new ApplicationError(ErrorCode.NETWORK_UNREACHABLE)

    expect(() => handleCommandError(error)).toThrow('process.exit called')
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Could not contact'))
    expect(process.exit).toHaveBeenCalledWith(ErrorCode.NETWORK_UNREACHABLE)
  })

  it('should handle generic Error with GENERIC code', () => {
    const error = new Error('Something broke')

    expect(() => handleCommandError(error)).toThrow('process.exit called')
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Something broke'))
    expect(process.exit).toHaveBeenCalledWith(ErrorCode.GENERIC)
  })

  it('should handle string error with GENERIC code', () => {
    expect(() => handleCommandError('String error message')).toThrow('process.exit called')
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('String error message'))
    expect(process.exit).toHaveBeenCalledWith(ErrorCode.GENERIC)
  })

  it('should format error message before logging for ApplicationError', () => {
    const error = new ApplicationError(ErrorCode.LEAGUE_NOT_FOUND_BY_CODE, 'XYZ')

    expect(() => handleCommandError(error)).toThrow('process.exit called')
    expect(console.error).toHaveBeenCalledWith(
      formatErrorForPrinting(ErrorCode.LEAGUE_NOT_FOUND_BY_CODE, 'XYZ'),
    )
  })

  it('should call console.error exactly once', () => {
    const error = new ApplicationError(ErrorCode.API_KEY_MISSING)

    expect(() => handleCommandError(error)).toThrow('process.exit called')
    expect(console.error).toHaveBeenCalledTimes(1)
  })

  it('should call process.exit exactly once', () => {
    const error = new ApplicationError(ErrorCode.API_KEY_MISSING)

    expect(() => handleCommandError(error)).toThrow('process.exit called')
    expect(process.exit).toHaveBeenCalledTimes(1)
  })
})
