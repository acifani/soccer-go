import p from 'phin'
import Cache from './Cache'
import { JSONValue } from './CacheItem'
import { getCacheDir } from '../utils/system-paths'
import { ApplicationError, ErrorCode } from '../utils/errors'

const cache = new Cache(getCacheDir())

export async function cachedApiCall(
  url: string,
  authToken: string | undefined,
  expiry: number,
): Promise<JSONValue> {
  const item = cache.get(url)
  if (item) {
    const age = Date.now() - item.date
    if (age < expiry) {
      return item.data
    }
    // data is expired
    cache.remove(url)
  }
  const response = await p({
    url,
    parse: 'json',
    headers: { 'X-Auth-Token': authToken },
  })

  if (response.statusCode == null || response.statusCode >= 400) {
    const error = response.body as { message: string }
    switch (response.statusCode) {
      case 400:
        if (error.message === 'Your API token is invalid.') {
          throw new ApplicationError(ErrorCode.API_KEY_INVALID)
        }
        throw new ApplicationError(ErrorCode.API_RESPONSE_400, error.message)
      case 429:
        throw new ApplicationError(ErrorCode.API_RESPONSE_429)
      default:
        throw new ApplicationError(ErrorCode.API_RESPONSE_500)
    }
  }

  const data = response.body as JSONValue
  cache.add(url, data)
  return data
}

process.on('exit', () => {
  if (cache) {
    cache.persist()
  }
})
