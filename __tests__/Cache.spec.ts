import Cache from './../src/cache/Cache'

const filePath = process.cwd()

describe('Cache', () => {
  describe('constructor', () => {
    it('should create file if it does not exist', () => {
      const cache = new Cache(filePath)

      expect(cache.has('a')).toBe(false)
    })

    it('should read existing file if it exists', () => {
      const data = { a: 'b' }
      const key = 'key'
      const cache1 = new Cache(filePath)
      cache1.add(key, data)
      cache1.persist()

      const cache2 = new Cache(filePath)
      const output = cache2.has(key)

      expect(output).toBe(true)
    })
  })

  describe('get', () => {
    it('should return undefined when item does not exist', () => {
      const cache = new Cache(filePath)

      const output = cache.get('i_do_not_exist')

      expect(output).toBeUndefined()
    })

    it('should return the item when item does exist', () => {
      const data = { a: 'b' }
      const key = 'key'
      const cache = new Cache(filePath)
      cache.add(key, data)

      const output = cache.get(key)

      expect(output).toBeTruthy()
      expect(output && output.data).toBe(data)
    })
  })

  describe('has', () => {
    it('should return false when item does not exist', () => {
      const cache = new Cache(filePath)

      const output = cache.has('i_do_not_exist')

      expect(output).toBe(false)
    })

    it('should return true when item does exist', () => {
      const data = { a: 'b' }
      const key = 'key'
      const cache = new Cache(filePath)
      cache.add(key, data)

      const output = cache.has(key)

      expect(output).toBe(true)
    })
  })

  describe('add', () => {
    it('should add the item to the collection', () => {
      const data = { a: 'b' }
      const key = 'key'
      const cache = new Cache(filePath)

      const output = cache.add(key, data)

      expect(output.has(key)).toBe(true)
    })
  })

  describe('remove', () => {
    it('should remove the item from the collection', () => {
      const data = { a: 'b' }
      const key = 'key'
      const cache = new Cache(filePath)
      cache.add(key, data)

      const output = cache.remove(key)

      expect(output).toBe(true)
      expect(cache.has(key)).toBe(false)
    })
  })
})
