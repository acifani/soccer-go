import * as fs from 'fs';
import * as path from 'path';
import cfg from '../config';
import CacheItem from './CacheItem';

export default class Cache {
  private file: string;
  private data: Map<string, CacheItem>;

  constructor(dir: string) {
    this.file = path.join(dir, cfg.cache.fileName);
    try {
      const buffer = fs.readFileSync(this.file);
      this.data = new Map(JSON.parse(buffer.toString('utf-8')));
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.data = new Map<string, CacheItem>();
        fs.writeFileSync(this.file, JSON.stringify(Array.from(this.data)));
      } else {
        throw error;
      }
    }
  }

  public add = (id: string, data: object) => {
    const res = this.data.set(id, new CacheItem(Date.now(), data));
    return res;
  };

  public remove = (id: string) => {
    const res = this.data.delete(id);
    return res;
  };

  public get = (id: string): CacheItem | undefined => this.data.get(id);

  public has = (id: string): boolean => this.data.has(id);

  public persist = () => {
    try {
      fs.writeFileSync(this.file, JSON.stringify(Array.from(this.data)));
    } catch (error) {
      throw error;
    }
  };
}
