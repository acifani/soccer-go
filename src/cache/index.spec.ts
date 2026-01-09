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
global.fetch = jest.fn()
jest.mock('./Cache', () => {
  return jest.fn().mockImplementation(() => mockCacheInstance)
})
jest.mock('../utils/system-paths')

import { getCacheDir } from '../utils/system-paths'
import { cachedApiCall } from './index'

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

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
      expect(mockFetch).not.toHaveBeenCalled()
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
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('cache miss scenarios', () => {
    it('should fetch from API when cache is empty', async () => {
      mockCacheInstance.get.mockReturnValue(undefined)

      const apiData = { matches: [{ id: 1, status: 'FINISHED' }] }
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => apiData,
        headers: new Headers(),
      } as Response)

      const result = await cachedApiCall('https://api.example.com/matches', 'mytoken', 5000)

      expect(result).toEqual(apiData)
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/matches', {
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
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => freshData,
        headers: new Headers(),
      } as Response)

      const result = await cachedApiCall('https://api.example.com/data', 'token', expiry)

      expect(result).toEqual(freshData)
      expect(mockCacheInstance.remove).toHaveBeenCalledWith('https://api.example.com/data')
      expect(mockFetch).toHaveBeenCalled()
      expect(mockCacheInstance.add).toHaveBeenCalledWith('https://api.example.com/data', freshData)
    })

    it('should include auth token in API request headers', async () => {
      mockCacheInstance.get.mockReturnValue(undefined)

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers(),
      } as Response)

      await cachedApiCall('https://api.example.com/test', 'my-secret-token', 1000)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
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
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Your API token is invalid.' }),
        headers: new Headers(),
      } as Response)

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
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid league code provided' }),
        headers: new Headers(),
      } as Response)

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
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({ message: 'Too many requests' }),
        headers: new Headers(),
      } as Response)

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
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
        headers: new Headers(),
      } as Response)

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
      mockFetch.mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({}),
        headers: new Headers(),
      } as Response)

      await expect(
        cachedApiCall('https://api.example.com/data', 'token', 1000),
      ).rejects.toMatchObject({
        code: ErrorCode.API_RESPONSE_500,
      })
    })

    it('should throw API_RESPONSE_500 when statusCode is null', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 0,
        json: async () => ({}),
        headers: new Headers(),
      } as Response)

      await expect(
        cachedApiCall('https://api.example.com/data', 'token', 1000),
      ).rejects.toMatchObject({
        code: ErrorCode.API_RESPONSE_500,
      })
    })

    it('should throw API_RESPONSE_500 when statusCode is undefined', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 0,
        json: async () => ({}),
        headers: new Headers(),
      } as Response)

      await expect(
        cachedApiCall('https://api.example.com/data', 'token', 1000),
      ).rejects.toMatchObject({
        code: ErrorCode.API_RESPONSE_500,
      })
    })

    it('should not add data to cache on error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
        headers: new Headers(),
      } as Response)

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
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => data,
        headers: new Headers(),
      } as Response)

      const result = await cachedApiCall('https://api.example.com/data', 'token', 1000)

      expect(result).toEqual(data)
      expect(mockCacheInstance.add).toHaveBeenCalledWith('https://api.example.com/data', data)
    })

    it('should handle 201 Created response', async () => {
      const data = { id: 123 }
      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => data,
        headers: new Headers(),
      } as Response)

      const result = await cachedApiCall('https://api.example.com/resource', 'token', 1000)

      expect(result).toEqual(data)
    })

    it('should handle response with array data', async () => {
      const data = [{ id: 1 }, { id: 2 }]
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => data,
        headers: new Headers(),
      } as Response)

      const result = await cachedApiCall('https://api.example.com/list', 'token', 1000)

      expect(result).toEqual(data)
      expect(Array.isArray(result)).toBe(true)
    })

    it('should handle response with string data', async () => {
      const data = 'plain text response'
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => data,
        headers: new Headers(),
      } as Response)

      const result = await cachedApiCall('https://api.example.com/text', 'token', 1000)

      expect(result).toEqual(data)
    })

    it('should handle response with number data', async () => {
      const data = 42
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => data,
        headers: new Headers(),
      } as Response)

      const result = await cachedApiCall('https://api.example.com/number', 'token', 1000)

      expect(result).toEqual(data)
    })

    it('should handle response with boolean data', async () => {
      const data = true
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => data,
        headers: new Headers(),
      } as Response)

      const result = await cachedApiCall('https://api.example.com/bool', 'token', 1000)

      expect(result).toEqual(data)
    })

    it('should handle response with null data', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => null,
        headers: new Headers(),
      } as Response)

      const result = await cachedApiCall('https://api.example.com/null', 'token', 1000)

      expect(result).toBeNull()
    })
  })

  describe('auth token handling', () => {
    beforeEach(() => {
      mockCacheInstance.get.mockReturnValue(undefined)
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers(),
      } as Response)
    })

    it('should pass undefined auth token to request', async () => {
      await cachedApiCall('https://api.example.com/data', undefined, 1000)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/data',
        expect.objectContaining({
          headers: { 'X-Auth-Token': '' },
        }),
      )
    })

    it('should pass empty string auth token to request', async () => {
      await cachedApiCall('https://api.example.com/data', '', 1000)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/data',
        expect.objectContaining({
          headers: { 'X-Auth-Token': '' },
        }),
      )
    })
  })
})
