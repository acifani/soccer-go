import fs from 'fs';
import path from 'path';
import cfg from '../config';
import CacheItem from './CacheItem';

type Data = Map<string, CacheItem>;

export default class Cache {
  private file: string;
  private data: Data;

  constructor(dir: string) {
    this.file = path.join(dir, cfg.cache.fileName);
    try {
      const buffer = fs.readFileSync(this.file);
      this.data = new Map(JSON.parse(buffer.toString('utf-8')));
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        this.data = new Map<string, CacheItem>();
        fs.writeFileSync(this.file, JSON.stringify(Array.from(this.data)));
      } else {
        throw error;
      }
    }
  }

  public add = (id: string, data: object): Data => {
    const res = this.data.set(id, new CacheItem(Date.now(), data));
    return res;
  };

  public remove = (id: string): boolean => {
    const res = this.data.delete(id);
    return res;
  };

  public get = (id: string): CacheItem | undefined => this.data.get(id);

  public has = (id: string): boolean => this.data.has(id);

  public persist = (): void => {
    fs.writeFileSync(this.file, JSON.stringify(Array.from(this.data)));
  };
}
