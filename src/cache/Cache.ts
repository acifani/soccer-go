import fs from 'fs'
import path from 'path'
import cfg from '../config'
import CacheItem from './CacheItem'
import { isErrorNodeSystemError } from '../utils/errors'

type Data = Map<string, CacheItem>

export default class Cache {
  private file: string
  private data: Data = new Map<string, CacheItem>()

  constructor(dir: string) {
    this.file = path.join(dir, cfg.cache.fileName)
    try {
      const buffer = fs.readFileSync(this.file)
      this.data = new Map(JSON.parse(buffer.toString('utf-8')))
    } catch (error: unknown) {
      if (isErrorNodeSystemError(error) && error.code === 'ENOENT') {
        // Cache file does not exist, so create it.
        this.data = new Map<string, CacheItem>()
        fs.writeFileSync(this.file, JSON.stringify(Array.from(this.data)))
      } else {
        // Some other error occurred but since it's about caching
        // we will ignore it and let the application work without it.
      }
    }
  }

  public add = (id: string, data: CacheItem['data']): Data => {
    const res = this.data.set(id, new CacheItem(Date.now(), data))
    return res
  }

  public remove = (id: string): boolean => {
    const res = this.data.delete(id)
    return res
  }

  public get = (id: string): CacheItem | undefined => this.data.get(id)

  public has = (id: string): boolean => this.data.has(id)

  public persist = (): void => {
    fs.writeFileSync(this.file, JSON.stringify(Array.from(this.data)))
  }
}
