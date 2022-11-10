import p from 'phin';
import Cache from './Cache';

const cache = new Cache(__dirname);

export const cachedApiCall = async (
  url: string,
  authToken: string | undefined,
  expiry: number
): Promise<any> => {
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
  const data = response.body as object;
  cache.add(url, data);
  return data;
};

process.on('exit', () => {
  if (cache) {
    cache.persist();
  }
});
