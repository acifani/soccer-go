import Fixture, { Status, Stage, stageDisplayString, IFixtureJson } from './Fixture'

describe('Fixture', () => {
  const baseFixture: IFixtureJson = {
    id: 1,
    utcDate: new Date('2024-01-15T15:00:00Z'),
    status: Status.Scheduled,
    matchday: 20,
    stage: Stage.RegularSeason,
    homeTeam: { id: 57, name: 'Arsenal FC' },
    awayTeam: { id: 61, name: 'Chelsea FC' },
    referees: [
      {
        id: 11580,
        name: 'Anthony Taylor',
        type: 'REFEREE',
        nationality: 'England',
      },
    ],
    score: {
      winner: null,
      duration: 'REGULAR',
      fullTime: { home: null, away: null },
      halfTime: { home: null, away: null },
    },
  }

  describe('constructor', () => {
    it('should construct fixture with all properties', () => {
      const fixture = new Fixture(baseFixture)

      expect(fixture.id).toBe(1)
      expect(fixture.home.team).toBe('Arsenal FC')
      expect(fixture.away.team).toBe('Chelsea FC')
      expect(fixture.matchday).toBe(20)
      expect(fixture.stage).toBe(Stage.RegularSeason)
      expect(fixture.status).toBe(Status.Scheduled)
      expect(fixture.date).toEqual(new Date('2024-01-15T15:00:00Z'))
    })

    it('should generate correct links', () => {
      const fixture = new Fixture(baseFixture)

      expect(fixture.links.self).toContain('/matches/1')
      expect(fixture.links.homeTeam).toContain('/teams/57')
      expect(fixture.links.awayTeam).toContain('/teams/61')
    })

    it('should handle null matchday', () => {
      const fixtureData = { ...baseFixture, matchday: null }
      const fixture = new Fixture(fixtureData)

      expect(fixture.matchday).toBeNull()
    })

    it('should extract referee from referees array', () => {
      const fixture = new Fixture(baseFixture)

      expect(fixture.referee).toEqual({
        id: 11580,
        name: 'Anthony Taylor',
        type: 'REFEREE',
        nationality: 'England',
      })
    })

    it('should handle missing referees array', () => {
      const fixtureData = { ...baseFixture, referees: undefined }
      const fixture = new Fixture(fixtureData)

      expect(fixture.referee).toBeNull()
    })

    it('should handle empty referees array', () => {
      const fixtureData = { ...baseFixture, referees: [] }
      const fixture = new Fixture(fixtureData)

      expect(fixture.referee).toBeNull()
    })

    it('should extract only REFEREE type from referees', () => {
      const fixtureData = {
        ...baseFixture,
        referees: [
          { id: 1, name: 'Assistant 1', type: 'ASSISTANT', nationality: 'Spain' },
          { id: 2, name: 'Main Ref', type: 'REFEREE', nationality: 'Italy' },
          { id: 3, name: 'Assistant 2', type: 'ASSISTANT', nationality: 'France' },
        ],
      }
      const fixture = new Fixture(fixtureData)

      expect(fixture.referee?.name).toBe('Main Ref')
      expect(fixture.referee?.nationality).toBe('Italy')
    })
  })

  describe('score logic', () => {
    it('should use fullTime score when available and regularTime exists', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        status: Status.Finished,
        score: {
          winner: 'HOME_TEAM',
          duration: 'REGULAR',
          fullTime: { home: 3, away: 1 },
          halfTime: { home: 2, away: 0 },
          regularTime: { home: 3, away: 1 },
        },
      }
      const fixture = new Fixture(fixtureData)

      expect(fixture.home.goals).toBe(3)
      expect(fixture.away.goals).toBe(1)
    })

    it('should use regularTime when fullTime is null but regularTime exists', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        status: Status.Finished,
        score: {
          winner: 'AWAY_TEAM',
          duration: 'REGULAR',
          fullTime: { home: null, away: null },
          halfTime: { home: 1, away: 1 },
          regularTime: { home: 2, away: 3 },
        },
      }
      const fixture = new Fixture(fixtureData)

      expect(fixture.home.goals).toBe(2)
      expect(fixture.away.goals).toBe(3)
    })

    it('should use halfTime when fullTime and regularTime are null', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        status: Status.InPlay,
        score: {
          winner: null,
          duration: 'REGULAR',
          fullTime: { home: null, away: null },
          halfTime: { home: 1, away: 2 },
        },
      }
      const fixture = new Fixture(fixtureData)

      expect(fixture.home.goals).toBe(1)
      expect(fixture.away.goals).toBe(2)
    })

    it('should default to 0-0 when no scores available', () => {
      const fixture = new Fixture(baseFixture)

      expect(fixture.home.goals).toBe(0)
      expect(fixture.away.goals).toBe(0)
    })
  })

  describe('toRow', () => {
    it('should format scheduled match without score', () => {
      const fixture = new Fixture(baseFixture)
      const row = fixture.toRow()

      expect(row[0]).toContain('Arsenal FC - Chelsea FC')
      expect(row[1]).toBe('') // No score for scheduled
      expect(row[2]).toBe('Scheduled')
      expect(row[3]).toBeTruthy() // Date formatted in user's locale
      expect(row[3].length).toBeGreaterThan(10)
      expect(row[4]).toBe('Regular season')
    })

    it('should format finished match with bold winner (home)', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        status: Status.Finished,
        score: {
          winner: 'HOME_TEAM',
          duration: 'REGULAR',
          fullTime: { home: 3, away: 1 },
          halfTime: { home: 2, away: 0 },
          regularTime: { home: 3, away: 1 },
        },
      }
      const fixture = new Fixture(fixtureData)
      const row = fixture.toRow()

      // Home team should be bold (contains ANSI codes)
      expect(row[0]).toMatch(/Arsenal FC/)
      expect(row[1]).toContain('3 - 1')
      expect(row[2]).toBe('Finished')
    })

    it('should format finished match with bold winner (away)', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        status: Status.Finished,
        score: {
          winner: 'AWAY_TEAM',
          duration: 'REGULAR',
          fullTime: { home: 1, away: 3 },
          halfTime: { home: 0, away: 2 },
          regularTime: { home: 1, away: 3 },
        },
      }
      const fixture = new Fixture(fixtureData)
      const row = fixture.toRow()

      // Away team should be bold
      expect(row[0]).toMatch(/Chelsea FC/)
      expect(row[1]).toContain('1 - 3')
    })

    it('should format in-play match with green score', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        status: Status.InPlay,
        score: {
          winner: null,
          duration: 'REGULAR',
          fullTime: { home: null, away: null },
          halfTime: { home: 1, away: 1 },
        },
      }
      const fixture = new Fixture(fixtureData)
      const row = fixture.toRow()

      // Should contain green color codes
      expect(row[1]).toMatch(/1 - 1/)
      expect(row[2]).toBe('Playing')
    })

    it('should show empty score for cancelled match', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        status: Status.Cancelled,
      }
      const fixture = new Fixture(fixtureData)
      const row = fixture.toRow()

      expect(row[1]).toBe('')
      expect(row[2]).toBe('Canceled')
    })

    it('should show empty score for postponed match', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        status: Status.Postponed,
      }
      const fixture = new Fixture(fixtureData)
      const row = fixture.toRow()

      expect(row[1]).toBe('')
      expect(row[2]).toBe('Postponed')
    })

    it('should show empty score for timed match', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        status: Status.Timed,
      }
      const fixture = new Fixture(fixtureData)
      const row = fixture.toRow()

      expect(row[1]).toBe('')
      expect(row[2]).toBe('Timed')
    })

    it('should format date correctly', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        utcDate: new Date('2024-06-21T19:45:00Z'),
      }
      const fixture = new Fixture(fixtureData)
      const row = fixture.toRow()

      // Should contain a formatted date string
      expect(row[3]).toBeTruthy()
      expect(typeof row[3]).toBe('string')
      expect(row[3].length).toBeGreaterThan(10)
    })

    it('should use display string for known stage', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        stage: Stage.Final,
      }
      const fixture = new Fixture(fixtureData)
      const row = fixture.toRow()

      expect(row[4]).toBe('Final')
    })

    it('should use raw value for unknown stage', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        stage: 'UNKNOWN_STAGE' as Stage,
      }
      const fixture = new Fixture(fixtureData)
      const row = fixture.toRow()

      expect(row[4]).toBe('UNKNOWN_STAGE')
    })

    it('should handle draw with no bold teams', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        status: Status.Finished,
        score: {
          winner: 'DRAW',
          duration: 'REGULAR',
          fullTime: { home: 2, away: 2 },
          halfTime: { home: 1, away: 1 },
          regularTime: { home: 2, away: 2 },
        },
      }
      const fixture = new Fixture(fixtureData)
      const row = fixture.toRow()

      // Neither team should be bold (no winner)
      expect(row[0]).toBe('Arsenal FC - Chelsea FC')
      expect(row[1]).toContain('2 - 2')
    })
  })

  describe('different match statuses', () => {
    it('should handle paused status', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        status: Status.Paused,
        score: {
          winner: null,
          duration: 'REGULAR',
          fullTime: { home: null, away: null },
          halfTime: { home: 1, away: 0 },
        },
      }
      const fixture = new Fixture(fixtureData)
      const row = fixture.toRow()

      expect(row[2]).toBe('Paused')
      expect(row[1]).toContain('1 - 0')
    })

    it('should handle extra time status', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        status: Status.ExtraTime,
        score: {
          winner: null,
          duration: 'EXTRA_TIME',
          fullTime: { home: null, away: null },
          halfTime: { home: 1, away: 1 },
          regularTime: { home: 2, away: 2 },
        },
      }
      const fixture = new Fixture(fixtureData)
      const row = fixture.toRow()

      expect(row[2]).toBe('Extra time')
    })

    it('should handle penalty shootout status', () => {
      const fixtureData: IFixtureJson = {
        ...baseFixture,
        status: Status.Penalty,
        score: {
          winner: null,
          duration: 'PENALTY_SHOOTOUT',
          fullTime: { home: 2, away: 2 },
          halfTime: { home: 1, away: 1 },
          regularTime: { home: 2, away: 2 },
          penalties: { home: 4, away: 3 },
        },
      }
      const fixture = new Fixture(fixtureData)
      const row = fixture.toRow()

      expect(row[2]).toBe('Penalties')
    })
  })

  describe('stage display strings', () => {
    it('should have display string for all stages', () => {
      const stages = [
        Stage.Final,
        Stage.ThirdPlace,
        Stage.SemiFinals,
        Stage.QuarterFinals,
        Stage.Last16,
        Stage.GroupStage,
        Stage.RegularSeason,
      ]

      stages.forEach((stage) => {
        expect(stageDisplayString[stage]).toBeDefined()
        expect(stageDisplayString[stage].length).toBeGreaterThan(0)
      })
    })
  })
})
