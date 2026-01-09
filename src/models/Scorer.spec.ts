import Scorer, { IScorerJson } from './Scorer'

describe('Scorer', () => {
  const baseScorer: IScorerJson = {
    player: {
      id: 38101,
      name: 'Erling Haaland',
      firstName: 'Erling',
      lastName: 'Haaland',
      dateOfBirth: '2000-07-21',
      nationality: 'Norway',
      section: 'Offense',
      position: 'Centre-Forward',
      shirtNumber: 9,
      lastUpdated: '2025-04-02T09:41:03Z',
    },
    team: {
      id: 65,
      name: 'Manchester City FC',
      shortName: 'Man City',
      tla: 'MCI',
      crest: 'https://crests.football-data.org/65.png',
      address: 'SportCity Manchester M11 3FF',
      website: 'https://www.mancity.com',
      founded: 1880,
      clubColors: 'Sky Blue / White',
      venue: 'Etihad Stadium',
      lastUpdated: '2022-02-10T19:48:37Z',
    },
    playedMatches: 21,
    goals: 20,
    assists: 4,
    penalties: 2,
  }

  describe('constructor', () => {
    it('should construct scorer with all properties mapped correctly', () => {
      const scorer = new Scorer(baseScorer)

      expect(scorer.playerName).toBe('Erling Haaland')
      expect(scorer.teamName).toBe('Man City')
      expect(scorer.goals).toBe(20)
      expect(scorer.assists).toBe(4)
      expect(scorer.penalties).toBe(2)
      expect(scorer.playedMatches).toBe(21)
    })

    it('should use team full name when shortName is not available', () => {
      const scorerData = {
        ...baseScorer,
        team: { ...baseScorer.team, shortName: '' },
      }
      const scorer = new Scorer(scorerData)

      expect(scorer.teamName).toBe('Manchester City FC')
    })

    it('should handle null assists gracefully', () => {
      const scorerData = { ...baseScorer, assists: null }
      const scorer = new Scorer(scorerData)

      expect(scorer.assists).toBeNull()
    })

    it('should handle null penalties gracefully', () => {
      const scorerData = { ...baseScorer, penalties: null }
      const scorer = new Scorer(scorerData)

      expect(scorer.penalties).toBeNull()
    })

    it('should handle both assists and penalties as null', () => {
      const scorerData = { ...baseScorer, assists: null, penalties: null }
      const scorer = new Scorer(scorerData)

      expect(scorer.assists).toBeNull()
      expect(scorer.penalties).toBeNull()
    })
  })

  describe('toRow', () => {
    it('should return array with all fields in correct order', () => {
      const scorer = new Scorer(baseScorer)
      const row = scorer.toRow(0)

      expect(row).toHaveLength(7)
      expect(row[0]).toBe(1) // rank
      expect(row[1]).toBe('Erling Haaland') // playerName
      expect(row[2]).toBe('Man City') // teamName
      expect(row[3]).toBe(20) // goals
      expect(row[4]).toBe(4) // assists
      expect(row[5]).toBe(2) // penalties
      expect(row[6]).toBe(21) // playedMatches
    })

    it('should return 0 for null assists in toRow', () => {
      const scorerData = { ...baseScorer, assists: null }
      const scorer = new Scorer(scorerData)
      const row = scorer.toRow(0)

      expect(row[4]).toBe(0) // assists should be 0
    })

    it('should return 0 for null penalties in toRow', () => {
      const scorerData = { ...baseScorer, penalties: null }
      const scorer = new Scorer(scorerData)
      const row = scorer.toRow(0)

      expect(row[5]).toBe(0) // penalties should be 0
    })

    it('should handle both null values correctly in toRow', () => {
      const scorerData = { ...baseScorer, assists: null, penalties: null }
      const scorer = new Scorer(scorerData)
      const row = scorer.toRow(0)

      expect(row[4]).toBe(0) // assists should be 0
      expect(row[5]).toBe(0) // penalties should be 0
    })
  })
})
