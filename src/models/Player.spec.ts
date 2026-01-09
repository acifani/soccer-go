import Player, { IPlayerJson } from './Player'

describe('Player', () => {
  const basePlayer: IPlayerJson = {
    id: 1,
    name: 'Bukayo Saka',
    position: 'Right Winger',
    dateOfBirth: '2001-09-05',
    nationality: 'England',
  }

  describe('constructor', () => {
    it('should construct player with all properties', () => {
      const player = new Player(basePlayer)

      expect(player.name).toBe('Bukayo Saka')
      expect(player.position).toBe('Right Winger')
      expect(player.dateOfBirth).toBe('2001-09-05')
      expect(player.nationality).toBe('England')
    })
  })

  describe('toRow', () => {
    it('should return array with all fields in correct order', () => {
      const player = new Player(basePlayer)
      const row = player.toRow()

      expect(row).toHaveLength(4)
      expect(row[0]).toBe('Bukayo Saka')
      expect(row[1]).toBe('Right Winger')
      expect(row[2]).toBe('England')
      expect(row[3]).toBe('09/05/2001')
    })

    it('should format date as MM/DD/YYYY', () => {
      const player = new Player(basePlayer)
      const row = player.toRow()

      expect(row[3]).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
    })

    it('should handle different date formats', () => {
      const playerData = { ...basePlayer, dateOfBirth: '1995-12-25' }
      const player = new Player(playerData)
      const row = player.toRow()

      expect(row[3]).toBe('12/25/1995')
    })

    it('should handle leap year dates', () => {
      const playerData = { ...basePlayer, dateOfBirth: '2000-02-29' }
      const player = new Player(playerData)
      const row = player.toRow()

      expect(row[3]).toBe('02/29/2000')
    })
  })

  describe('different positions', () => {
    it('should handle goalkeeper position', () => {
      const playerData = { ...basePlayer, position: 'Goalkeeper', name: 'Aaron Ramsdale' }
      const player = new Player(playerData)

      expect(player.position).toBe('Goalkeeper')
    })

    it('should handle defender position', () => {
      const playerData = { ...basePlayer, position: 'Centre-Back', name: 'William Saliba' }
      const player = new Player(playerData)

      expect(player.position).toBe('Centre-Back')
    })

    it('should handle midfielder position', () => {
      const playerData = { ...basePlayer, position: 'Defensive Midfield', name: 'Declan Rice' }
      const player = new Player(playerData)

      expect(player.position).toBe('Defensive Midfield')
    })

    it('should handle forward position', () => {
      const playerData = { ...basePlayer, position: 'Centre-Forward', name: 'Gabriel Jesus' }
      const player = new Player(playerData)

      expect(player.position).toBe('Centre-Forward')
    })
  })

  describe('different nationalities', () => {
    it('should handle various nationalities', () => {
      const nationalities = ['Brazil', 'Spain', 'France', 'Germany', 'Argentina']

      nationalities.forEach((nationality) => {
        const playerData = { ...basePlayer, nationality }
        const player = new Player(playerData)

        expect(player.nationality).toBe(nationality)
      })
    })
  })
})
