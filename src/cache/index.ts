import axios, { AxiosRequestConfig } from 'axios';
import Cache from './Cache';

const cache = new Cache(__dirname);

export const cachedApiCall = async (
  url: string,
  axiosCfg: AxiosRequestConfig,
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
  try {
    const response = await axios.get(url, axiosCfg);
    const data = response.data;
    cache.add(url, data);
    return data;
  } catch (error) {
    throw error;
  }
};

process.on('exit', () => {
  if (cache) {
    cache.persist();
  }
});
