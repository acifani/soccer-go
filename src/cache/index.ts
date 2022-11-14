import p from 'phin';
import Cache from './Cache';
import { JSONValue } from './CacheItem';

const cache = new Cache(__dirname);

export async function cachedApiCall(
  url: string,
  authToken: string | undefined,
  expiry: number
): Promise<JSONValue> {
  const item = cache.get(url);
  if (item) {
    const age = Date.now() - item.date;
    if (age < expiry) {
      return item.data;
    }
    // data is expired
    cache.remove(url);
  }
  const response = await p({
    url,
    parse: 'json',
    headers: { 'X-Auth-Token': authToken },
  });

  if (response.statusCode == null || response.statusCode >= 400) {
    const error = response.body as any;
    throw Error(error.message as string);
  }

  const data = response.body as JSONValue;
  cache.add(url, data);
  return data;
}

process.on('exit', () => {
  if (cache) {
    cache.persist();
  }
});
