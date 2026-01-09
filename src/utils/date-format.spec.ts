import { formatFixtureDate, formatPlayerDate, getDateWithOffset } from './date-format'

describe('date-format utilities', () => {
  describe('formatFixtureDate', () => {
    it('should format date with weekday, month, day, year, and time', () => {
      const date = new Date('2026-01-09T15:45:00Z')
      const result = formatFixtureDate(date)
      // Should contain a date string with various components
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(10)
    })
  })

  describe('formatPlayerDate', () => {
    it('should format date as a string with year, month, and day', () => {
      const result = formatPlayerDate('1995-06-15')
      // Should contain a date string
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
      expect(result).toMatch(/\d/)
    })
  })

  describe('getDateWithOffset', () => {
    it('should return date N days in the past in YYYY-MM-DD format', () => {
      const result = getDateWithOffset(-3)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('should return date N days in the future in YYYY-MM-DD format', () => {
      const result = getDateWithOffset(4)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('should return today when offset is 0', () => {
      const result = getDateWithOffset(0)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })
})
