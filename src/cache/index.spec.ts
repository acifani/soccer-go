/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationError, ErrorCode } from '../utils/errors'

// Create mock cache instance
const mockCacheInstance: any = {
  get: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
  has: jest.fn(),
  persist: jest.fn(),
}

// Mock dependencies - MUST be before module under test is imported
jest.mock('phin')
jest.mock('./Cache', () => {
  return jest.fn().mockImplementation(() => mockCacheInstance)
})
jest.mock('../utils/system-paths')

import p from 'phin'
import { getCacheDir } from '../utils/system-paths'
import { cachedApiCall } from './index'

const mockPhin = p as any as jest.MockedFunction<typeof p>

describe('cachedApiCall', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getCacheDir as jest.Mock).mockReturnValue('/tmp/.soccergo-cache')
  })

  describe('cache hit scenarios', () => {
    it('should return cached data when cache is fresh', async () => {
      const cachedData = { fixtures: [{ id: 1 }] }
      const now = Date.now()

      mockCacheInstance.get.mockReturnValue({
        date: now - 1000, // 1 second ago
        data: cachedData,
      })

      const result = await cachedApiCall(
        'https://api.football-data.org/v4/matches',
        'token',
        5000, // 5 second expiry
      )

      expect(result).toEqual(cachedData)
      expect(mockCacheInstance.get).toHaveBeenCalledWith('https://api.football-data.org/v4/matches')
      expect(mockPhin).not.toHaveBeenCalled()
      expect(mockCacheInstance.add).not.toHaveBeenCalled()
    })

    it('should return cached data when just under expiry time', async () => {
      const cachedData = { standings: [] }
      const expiry = 3600000 // 1 hour
      const now = Date.now()

      mockCacheInstance.get.mockReturnValue({
        date: now - expiry + 1000, // 1 second before expiry
        data: cachedData,
      })

      const result = await cachedApiCall('https://api.example.com/standings', 'token', expiry)

      expect(result).toEqual(cachedData)
      expect(mockPhin).not.toHaveBeenCalled()
    })
  })

  describe('cache miss scenarios', () => {
    it('should fetch from API when cache is empty', async () => {
      mockCacheInstance.get.mockReturnValue(undefined)

      const apiData = { matches: [{ id: 1, status: 'FINISHED' }] }
      mockPhin.mockResolvedValue({
        statusCode: 200,
        body: apiData as any,
        headers: {},
      } as any)

      const result = await cachedApiCall('https://api.example.com/matches', 'mytoken', 5000)

      expect(result).toEqual(apiData)
      expect(mockPhin).toHaveBeenCalledWith({
        url: 'https://api.example.com/matches',
        parse: 'json',
        headers: { 'X-Auth-Token': 'mytoken' },
      })
      expect(mockCacheInstance.add).toHaveBeenCalledWith('https://api.example.com/matches', apiData)
    })

    it('should fetch from API when cache is expired', async () => {
      const expiry = 5000
      const now = Date.now()

      mockCacheInstance.get.mockReturnValue({
        date: now - expiry - 1000, // 1 second past expiry
        data: { old: 'data' },
      })

      const freshData = { new: 'data' }
      mockPhin.mockResolvedValue({
        statusCode: 200,
        body: freshData as any,
        headers: {},
      } as any)

      const result = await cachedApiCall('https://api.example.com/data', 'token', expiry)

      expect(result).toEqual(freshData)
      expect(mockCacheInstance.remove).toHaveBeenCalledWith('https://api.example.com/data')
      expect(mockPhin).toHaveBeenCalled()
      expect(mockCacheInstance.add).toHaveBeenCalledWith('https://api.example.com/data', freshData)
    })

    it('should include auth token in API request headers', async () => {
      mockCacheInstance.get.mockReturnValue(undefined)

      mockPhin.mockResolvedValue({
        statusCode: 200,
        body: {} as any,
        headers: {},
      } as any)

      await cachedApiCall('https://api.example.com/test', 'my-secret-token', 1000)

      expect(mockPhin).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: { 'X-Auth-Token': 'my-secret-token' },
        }),
      )
    })
  })

  describe('HTTP error handling', () => {
    beforeEach(() => {
      mockCacheInstance.get.mockReturnValue(undefined)
    })

    it('should throw API_KEY_INVALID on 400 with invalid token message', async () => {
      mockPhin.mockResolvedValue({
        statusCode: 400,
        body: { message: 'Your API token is invalid.' } as any,
        headers: {},
      } as any)

      await expect(cachedApiCall('https://api.example.com/data', 'badtoken', 1000)).rejects.toThrow(
        ApplicationError,
      )

      await expect(
        cachedApiCall('https://api.example.com/data', 'badtoken', 1000),
      ).rejects.toMatchObject({
        code: ErrorCode.API_KEY_INVALID,
      })
    })

    it('should throw API_RESPONSE_400 on 400 with other error message', async () => {
      mockPhin.mockResolvedValue({
        statusCode: 400,
        body: { message: 'Invalid league code provided' } as any,
        headers: {},
      } as any)

      await expect(cachedApiCall('https://api.example.com/data', 'token', 1000)).rejects.toThrow(
        ApplicationError,
      )

      await expect(
        cachedApiCall('https://api.example.com/data', 'token', 1000),
      ).rejects.toMatchObject({
        code: ErrorCode.API_RESPONSE_400,
        extraData: 'Invalid league code provided',
      })
    })

    it('should throw API_RESPONSE_429 on 429 rate limit', async () => {
      mockPhin.mockResolvedValue({
        statusCode: 429,
        body: { message: 'Too many requests' } as any,
        headers: {},
      } as any)

      await expect(cachedApiCall('https://api.example.com/data', 'token', 1000)).rejects.toThrow(
        ApplicationError,
      )

      await expect(
        cachedApiCall('https://api.example.com/data', 'token', 1000),
      ).rejects.toMatchObject({
        code: ErrorCode.API_RESPONSE_429,
      })
    })

    it('should throw API_RESPONSE_500 on 500 server error', async () => {
      mockPhin.mockResolvedValue({
        statusCode: 500,
        body: { message: 'Internal server error' } as any,
        headers: {},
      } as any)

      await expect(cachedApiCall('https://api.example.com/data', 'token', 1000)).rejects.toThrow(
        ApplicationError,
      )

      await expect(
        cachedApiCall('https://api.example.com/data', 'token', 1000),
      ).rejects.toMatchObject({
        code: ErrorCode.API_RESPONSE_500,
      })
    })

    it('should throw API_RESPONSE_500 on 503 service unavailable', async () => {
      mockPhin.mockResolvedValue({
        statusCode: 503,
        body: {} as any,
        headers: {},
      } as any)

      await expect(
        cachedApiCall('https://api.example.com/data', 'token', 1000),
      ).rejects.toMatchObject({
        code: ErrorCode.API_RESPONSE_500,
      })
    })

    it('should throw API_RESPONSE_500 when statusCode is null', async () => {
      mockPhin.mockResolvedValue({
        statusCode: null as any,
        body: {},
        headers: {},
      } as any)

      await expect(
        cachedApiCall('https://api.example.com/data', 'token', 1000),
      ).rejects.toMatchObject({
        code: ErrorCode.API_RESPONSE_500,
      })
    })

    it('should throw API_RESPONSE_500 when statusCode is undefined', async () => {
      mockPhin.mockResolvedValue({
        statusCode: undefined as any,
        body: {},
        headers: {},
      } as any)

      await expect(
        cachedApiCall('https://api.example.com/data', 'token', 1000),
      ).rejects.toMatchObject({
        code: ErrorCode.API_RESPONSE_500,
      })
    })

    it('should not add data to cache on error', async () => {
      mockPhin.mockResolvedValue({
        statusCode: 500,
        body: {},
        headers: {},
      } as any)

      await expect(cachedApiCall('https://api.example.com/data', 'token', 1000)).rejects.toThrow()

      expect(mockCacheInstance.add).not.toHaveBeenCalled()
    })
  })

  describe('successful API responses', () => {
    beforeEach(() => {
      mockCacheInstance.get.mockReturnValue(undefined)
    })

    it('should handle 200 OK response', async () => {
      const data = { success: true }
      mockPhin.mockResolvedValue({
        statusCode: 200,
        body: data as any,
        headers: {},
      } as any)

      const result = await cachedApiCall('https://api.example.com/data', 'token', 1000)

      expect(result).toEqual(data)
      expect(mockCacheInstance.add).toHaveBeenCalledWith('https://api.example.com/data', data)
    })

    it('should handle 201 Created response', async () => {
      const data = { id: 123 }
      mockPhin.mockResolvedValue({
        statusCode: 201,
        body: data as any,
        headers: {},
      } as any)

      const result = await cachedApiCall('https://api.example.com/resource', 'token', 1000)

      expect(result).toEqual(data)
    })

    it('should handle response with array data', async () => {
      const data = [{ id: 1 }, { id: 2 }]
      mockPhin.mockResolvedValue({
        statusCode: 200,
        body: data as any,
        headers: {},
      } as any)

      const result = await cachedApiCall('https://api.example.com/list', 'token', 1000)

      expect(result).toEqual(data)
      expect(Array.isArray(result)).toBe(true)
    })

    it('should handle response with string data', async () => {
      const data = 'plain text response'
      mockPhin.mockResolvedValue({
        statusCode: 200,
        body: data as any,
        headers: {},
      } as any)

      const result = await cachedApiCall('https://api.example.com/text', 'token', 1000)

      expect(result).toEqual(data)
    })

    it('should handle response with number data', async () => {
      const data = 42
      mockPhin.mockResolvedValue({
        statusCode: 200,
        body: data as any,
        headers: {},
      } as any)

      const result = await cachedApiCall('https://api.example.com/number', 'token', 1000)

      expect(result).toEqual(data)
    })

    it('should handle response with boolean data', async () => {
      const data = true
      mockPhin.mockResolvedValue({
        statusCode: 200,
        body: data as any,
        headers: {},
      } as any)

      const result = await cachedApiCall('https://api.example.com/bool', 'token', 1000)

      expect(result).toEqual(data)
    })

    it('should handle response with null data', async () => {
      mockPhin.mockResolvedValue({
        statusCode: 200,
        body: null as any,
        headers: {},
      } as any)

      const result = await cachedApiCall('https://api.example.com/null', 'token', 1000)

      expect(result).toBeNull()
    })
  })

  describe('auth token handling', () => {
    beforeEach(() => {
      mockCacheInstance.get.mockReturnValue(undefined)
      mockPhin.mockResolvedValue({
        statusCode: 200,
        body: {} as any,
        headers: {},
      } as any)
    })

    it('should pass undefined auth token to request', async () => {
      await cachedApiCall('https://api.example.com/data', undefined, 1000)

      expect(mockPhin).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: { 'X-Auth-Token': undefined },
        }),
      )
    })

    it('should pass empty string auth token to request', async () => {
      await cachedApiCall('https://api.example.com/data', '', 1000)

      expect(mockPhin).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: { 'X-Auth-Token': '' },
        }),
      )
    })
  })
})
