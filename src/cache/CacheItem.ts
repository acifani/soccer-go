export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export default class CacheItem {
  public date: number;
  public data: JSONValue;
  constructor(date: number, data: JSONValue) {
    this.date = date || Date.now();
    this.data = data;
  }
}
