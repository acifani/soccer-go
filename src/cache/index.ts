import axios, { AxiosRequestConfig } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import cfg from '../config';
import Cache from './Cache';

const baseDir = process.cwd();
const cache = new Cache(baseDir);

export const cachedApiCall = async (
  url: string,
  axiosCfg: AxiosRequestConfig
): Promise<any> => {
  const item = cache.get(url);
  if (item) {
    const age = Date.now() - item.date;
    if (age < cfg.cache.expiry) {
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
