import Standing, { IStandingJson } from './Standing'

describe('Standing', () => {
  const baseStanding: IStandingJson = {
    position: 1,
    team: {
      id: 57,
      name: 'Arsenal FC',
      shortName: 'Arsenal',
      tla: 'ARS',
      crest: 'https://example.com/crest.png',
    },
    playedGames: 20,
    form: 'W,W,D,W,L',
    won: 15,
    draw: 3,
    lost: 2,
    points: 48,
    goalsFor: 45,
    goalsAgainst: 15,
    goalDifference: 30,
  }

  describe('constructor', () => {
    it('should construct standing with all properties mapped correctly', () => {
      const standing = new Standing(baseStanding)

      expect(standing.rank).toBe(1)
      expect(standing.team).toBe('Arsenal FC')
      expect(standing.playedGames).toBe(20)
      expect(standing.points).toBe(48)
      expect(standing.goals).toBe(45)
      expect(standing.goalsAgainst).toBe(15)
      expect(standing.goalDifference).toBe(30)
      expect(standing.wins).toBe(15)
      expect(standing.draws).toBe(3)
      expect(standing.losses).toBe(2)
      expect(standing.form).toBe('W,W,D,W,L')
    })

    it('should handle null form', () => {
      const standingData = { ...baseStanding, form: null }
      const standing = new Standing(standingData)

      expect(standing.form).toBeNull()
    })
  })

  describe('toRow', () => {
    it('should return array with all fields in correct order', () => {
      const standing = new Standing(baseStanding)
      const row = standing.toRow()

      expect(row).toHaveLength(11)
      expect(row[0]).toBe(1) // rank
      expect(row[1]).toBe('Arsenal FC') // team
      expect(row[2]).toBe(20) // playedGames
      expect(row[3]).toBe(48) // points
      expect(row[4]).toBe(15) // wins
      expect(row[5]).toBe(3) // draws
      expect(row[6]).toBe(2) // losses
      expect(row[7]).toBe(45) // goals
      expect(row[8]).toBe(15) // goalsAgainst
      expect(row[9]).toBe(30) // goalDifference
      expect(typeof row[10]).toBe('string') // formatted form
    })

    it('should format form with colored indicators', () => {
      const standing = new Standing(baseStanding)
      const row = standing.toRow()

      // Form should contain W, D, L characters
      const formString = row[10] as string
      expect(formString).toContain('W')
      expect(formString).toContain('D')
      expect(formString).toContain('L')
    })

    it('should handle null form by returning empty string', () => {
      const standingData = { ...baseStanding, form: null }
      const standing = new Standing(standingData)
      const row = standing.toRow()

      expect(row[10]).toBe('')
    })

    it('should handle empty form string', () => {
      const standingData = { ...baseStanding, form: '' }
      const standing = new Standing(standingData)
      const row = standing.toRow()

      expect(row[10]).toBe('')
    })
  })

  describe('form formatting', () => {
    it('should format only wins', () => {
      const standingData = { ...baseStanding, form: 'W,W,W,W,W' }
      const standing = new Standing(standingData)
      const row = standing.toRow()

      const formString = row[10] as string
      expect(formString).toContain('W')
      expect(formString).not.toContain('D')
      expect(formString).not.toContain('L')
    })

    it('should format only draws', () => {
      const standingData = { ...baseStanding, form: 'D,D,D,D,D' }
      const standing = new Standing(standingData)
      const row = standing.toRow()

      const formString = row[10] as string
      expect(formString).toContain('D')
      expect(formString).not.toContain('W')
      expect(formString).not.toContain('L')
    })

    it('should format only losses', () => {
      const standingData = { ...baseStanding, form: 'L,L,L,L,L' }
      const standing = new Standing(standingData)
      const row = standing.toRow()

      const formString = row[10] as string
      expect(formString).toContain('L')
      expect(formString).not.toContain('W')
      expect(formString).not.toContain('D')
    })

    it('should format mixed form results', () => {
      const standingData = { ...baseStanding, form: 'W,L,D,W,W' }
      const standing = new Standing(standingData)
      const row = standing.toRow()

      const formString = row[10] as string
      expect(formString).toContain('W')
      expect(formString).toContain('D')
      expect(formString).toContain('L')
    })
  })

  describe('edge cases', () => {
    it('should handle team at bottom of table', () => {
      const standingData: IStandingJson = {
        ...baseStanding,
        position: 20,
        won: 2,
        draw: 3,
        lost: 15,
        points: 9,
        goalsFor: 15,
        goalsAgainst: 45,
        goalDifference: -30,
        form: 'L,L,L,L,D',
      }
      const standing = new Standing(standingData)

      expect(standing.rank).toBe(20)
      expect(standing.points).toBe(9)
      expect(standing.goalDifference).toBe(-30)
    })

    it('should handle team with zero stats', () => {
      const standingData: IStandingJson = {
        ...baseStanding,
        won: 0,
        draw: 0,
        lost: 0,
        playedGames: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        form: null,
      }
      const standing = new Standing(standingData)
      const row = standing.toRow()

      expect(row[2]).toBe(0) // playedGames
      expect(row[3]).toBe(0) // points
      expect(row[4]).toBe(0) // wins
      expect(row[5]).toBe(0) // draws
      expect(row[6]).toBe(0) // losses
      expect(row[10]).toBe('') // empty form
    })

    it('should handle single character in form', () => {
      const standingData = { ...baseStanding, form: 'W' }
      const standing = new Standing(standingData)
      const row = standing.toRow()

      const formString = row[10] as string
      expect(formString).toContain('W')
    })
  })
})
