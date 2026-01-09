import {
  getMatchday,
  getTeam,
  getTeamFixtures,
  getCompetitionTeams,
  getStandings,
  getTeamId,
  getScorers,
} from './api'
import { ApplicationError, ErrorCode } from './utils/errors'
import { Team } from './models'

// Mock dependencies
jest.mock('./cache')
jest.mock('nanospinner')
jest.mock('./config')

import { cachedApiCall } from './cache'
import { createSpinner } from 'nanospinner'
import cfg from './config'

const mockCachedApiCall = cachedApiCall as jest.MockedFunction<typeof cachedApiCall>
const mockCreateSpinner = createSpinner as jest.MockedFunction<typeof createSpinner>

describe('API functions', () => {
  let mockSpinner: {
    start: jest.Mock
    success: jest.Mock
    error: jest.Mock
    clear: jest.Mock
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock spinner
    mockSpinner = {
      start: jest.fn().mockReturnThis(),
      success: jest.fn().mockReturnThis(),
      error: jest.fn().mockReturnThis(),
      clear: jest.fn().mockReturnThis(),
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockCreateSpinner.mockReturnValue(mockSpinner as any)

    // Mock config
    Object.assign(cfg, {
      apiBaseUrl: 'https://api.football-data.org/v4',
      authToken: 'test-token',
      cache: {
        expiry: {
          fixtures: 300000,
          scorers: 3600000,
          standings: 3600000,
          team: 604800000,
          competition: 2592000000,
        },
      },
    })
  })

  describe('getMatchday', () => {
    it('should fetch fixtures for date range (3 days before, 4 days after)', async () => {
      const mockMatches = [
        { id: 1, status: 'FINISHED' },
        { id: 2, status: 'SCHEDULED' },
      ]
      mockCachedApiCall.mockResolvedValue({ matches: mockMatches })

      const result = await getMatchday('PL')

      expect(result).toEqual(mockMatches)
      expect(mockCachedApiCall).toHaveBeenCalledWith(
        expect.stringMatching(/competitions\/PL\/matches\?dateFrom=.+&dateTo=.+/),
        'test-token',
        300000,
      )
      expect(mockSpinner.success).toHaveBeenCalled()
      expect(mockSpinner.clear).toHaveBeenCalled()
    })

    it('should show spinner during API call', async () => {
      mockCachedApiCall.mockResolvedValue({ matches: [] })

      await getMatchday('PD')

      expect(mockCreateSpinner).toHaveBeenCalledWith('Fetching matchday...')
      expect(mockSpinner.start).toHaveBeenCalled()
    })
  })

  describe('getTeam', () => {
    it('should fetch team by ID', async () => {
      const mockTeam = { id: 57, name: 'Arsenal', shortName: 'Arsenal' }
      mockCachedApiCall.mockResolvedValue(mockTeam)

      const result = await getTeam(57)

      expect(result).toEqual(mockTeam)
      expect(mockCachedApiCall).toHaveBeenCalledWith(
        'https://api.football-data.org/v4/teams/57',
        'test-token',
        604800000,
      )
    })

    it('should show spinner with correct message', async () => {
      mockCachedApiCall.mockResolvedValue({ id: 1, name: 'Test' })

      await getTeam(1)

      expect(mockCreateSpinner).toHaveBeenCalledWith('Fetching team...')
    })
  })

  describe('getTeamFixtures', () => {
    it('should fetch fixtures using team links', async () => {
      const mockTeam = new Team({
        id: 57,
        name: 'Arsenal',
        shortName: 'Arsenal',
        tla: 'ARS',
        crest: 'url',
        clubColors: 'Red / White',
        venue: 'Emirates',
        squad: [],
      })

      const mockMatches = [{ id: 1, status: 'SCHEDULED' }]
      mockCachedApiCall.mockResolvedValue({ matches: mockMatches })

      const result = await getTeamFixtures(mockTeam)

      expect(result).toEqual(mockMatches)
      expect(mockCachedApiCall).toHaveBeenCalledWith(
        expect.stringContaining('/teams/57/matches'),
        'test-token',
        300000,
      )
    })

    it('should show correct spinner message', async () => {
      const mockTeam = new Team({
        id: 1,
        name: 'Test',
        shortName: 'Test',
        tla: 'TST',
        crest: '',
        clubColors: '',
        venue: '',
        squad: [],
      })
      mockCachedApiCall.mockResolvedValue({ matches: [] })

      await getTeamFixtures(mockTeam)

      expect(mockCreateSpinner).toHaveBeenCalledWith('Fetching team fixtures...')
    })
  })

  describe('getCompetitionTeams', () => {
    it('should fetch all teams in competition', async () => {
      const mockTeams = [
        { id: 1, name: 'Team A' },
        { id: 2, name: 'Team B' },
      ]
      mockCachedApiCall.mockResolvedValue({ teams: mockTeams })

      const result = await getCompetitionTeams('PL')

      expect(result).toEqual(mockTeams)
      expect(mockCachedApiCall).toHaveBeenCalledWith(
        'https://api.football-data.org/v4/competitions/PL/teams',
        'test-token',
        2592000000,
      )
    })
  })

  describe('getStandings', () => {
    it('should fetch and filter TOTAL standings', async () => {
      const mockStandings = [
        { type: 'TOTAL', stage: 'REGULAR', group: null, table: [] },
        { type: 'HOME', stage: 'REGULAR', group: null, table: [] },
        { type: 'AWAY', stage: 'REGULAR', group: null, table: [] },
      ]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockCachedApiCall.mockResolvedValue({ standings: mockStandings } as any)

      const result = await getStandings('PL')

      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('TOTAL')
      expect(mockCachedApiCall).toHaveBeenCalledWith(
        'https://api.football-data.org/v4/competitions/PL/standings',
        'test-token',
        3600000,
      )
    })

    it('should handle empty standings array', async () => {
      mockCachedApiCall.mockResolvedValue({ standings: [] })

      const result = await getStandings('BL1')

      expect(result).toEqual([])
    })

    it('should handle undefined standings', async () => {
      mockCachedApiCall.mockResolvedValue({})

      const result = await getStandings('SA')

      expect(result).toBeUndefined()
    })
  })

  describe('getTeamId', () => {
    it('should find team by exact name match', async () => {
      const mockTeams = [
        { id: 57, name: 'Arsenal FC' },
        { id: 61, name: 'Chelsea FC' },
      ]
      mockCachedApiCall.mockResolvedValue({ teams: mockTeams })

      const result = await getTeamId('Arsenal', 'PL')

      expect(result).toBe(57)
    })

    it('should find team by partial name match (case insensitive)', async () => {
      const mockTeams = [
        { id: 65, name: 'Manchester City FC' },
        { id: 66, name: 'Manchester United FC' },
      ]
      mockCachedApiCall.mockResolvedValue({ teams: mockTeams })

      const result = await getTeamId('city', 'PL')

      expect(result).toBe(65)
    })

    it('should trim whitespace from team name', async () => {
      const mockTeams = [{ id: 86, name: 'Real Madrid CF' }]
      mockCachedApiCall.mockResolvedValue({ teams: mockTeams })

      const result = await getTeamId('  real madrid  ', 'PD')

      expect(result).toBe(86)
    })

    it('should throw TEAM_NOT_FOUND when team does not exist', async () => {
      const mockTeams = [{ id: 1, name: 'Team A' }]
      mockCachedApiCall.mockResolvedValue({ teams: mockTeams })

      await expect(getTeamId('NonExistent', 'PL')).rejects.toThrow(ApplicationError)
      await expect(getTeamId('NonExistent', 'PL')).rejects.toMatchObject({
        code: ErrorCode.TEAM_NOT_FOUND,
        extraData: 'NonExistent',
      })
    })
  })

  describe('getScorers', () => {
    it('should fetch top scorers for a league', async () => {
      const mockScorersResponse = {
        count: 2,
        scorers: [
          {
            player: { id: 38101, name: 'Erling Haaland' },
            team: { id: 65, name: 'Manchester City FC', shortName: 'Man City' },
            goals: 20,
            assists: 4,
            penalties: 2,
            playedMatches: 21,
          },
          {
            player: { id: 175994, name: 'Thiago Rodrigues' },
            team: { id: 402, name: 'Brentford FC', shortName: 'Brentford' },
            goals: 16,
            assists: 1,
            penalties: 5,
            playedMatches: 21,
          },
        ],
      }
      mockCachedApiCall.mockResolvedValue(mockScorersResponse)

      const result = await getScorers('PL')

      expect(result).toEqual(mockScorersResponse)
      expect(mockCachedApiCall).toHaveBeenCalledWith(
        'https://api.football-data.org/v4/competitions/PL/scorers',
        'test-token',
        3600000,
      )
      expect(mockSpinner.success).toHaveBeenCalled()
      expect(mockSpinner.clear).toHaveBeenCalled()
    })

    it('should show spinner during API call', async () => {
      const mockResponse = { count: 0, scorers: [] }
      mockCachedApiCall.mockResolvedValue(mockResponse)

      await getScorers('SA')

      expect(mockCreateSpinner).toHaveBeenCalledWith('Fetching top scorers...')
      expect(mockSpinner.start).toHaveBeenCalled()
    })

    it('should fetch scorers for different leagues', async () => {
      const mockResponse = { count: 1, scorers: [] }
      mockCachedApiCall.mockResolvedValue(mockResponse)

      await getScorers('BL1')

      expect(mockCachedApiCall).toHaveBeenCalledWith(
        'https://api.football-data.org/v4/competitions/BL1/scorers',
        'test-token',
        3600000,
      )
    })
  })

  describe('error handling', () => {
    it('should throw API_KEY_MISSING when no auth token and not in CI', async () => {
      Object.assign(cfg, { authToken: undefined })
      delete process.env.CI

      await expect(getMatchday('PL')).rejects.toThrow(ApplicationError)
      await expect(getMatchday('PL')).rejects.toMatchObject({
        code: ErrorCode.API_KEY_MISSING,
      })
      expect(mockSpinner.error).toHaveBeenCalled()
    })

    it('should throw NETWORK_UNREACHABLE on ENOTFOUND error', async () => {
      const networkError: NodeJS.ErrnoException = {
        name: 'Error',
        message: 'ENOTFOUND',
        code: 'ENOTFOUND',
        errno: -3008,
        syscall: 'getaddrinfo',
      }
      mockCachedApiCall.mockRejectedValue(networkError)

      await expect(getTeam(1)).rejects.toThrow(ApplicationError)
      await expect(getTeam(1)).rejects.toMatchObject({
        code: ErrorCode.NETWORK_UNREACHABLE,
      })
      expect(mockSpinner.error).toHaveBeenCalled()
    })

    it('should rethrow other errors unchanged', async () => {
      const customError = new ApplicationError(ErrorCode.API_RESPONSE_429)
      mockCachedApiCall.mockRejectedValue(customError)

      await expect(getStandings('PL')).rejects.toThrow(customError)
      expect(mockSpinner.error).toHaveBeenCalled()
    })
  })
})
