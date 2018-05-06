export default class CacheItem {
  public date: number;
  public data: object;
  constructor(date: number, data: object) {
    this.date = date || Date.now();
    this.data = data;
  }
}
