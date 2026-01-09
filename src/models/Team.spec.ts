import Team, { ITeamJson, ICoach } from './Team'

describe('Team', () => {
  const baseCoach: ICoach = {
    id: 179744,
    firstName: '',
    lastName: 'Mikel Arteta',
    name: 'Mikel Arteta',
    dateOfBirth: '1982-03-26',
    nationality: 'Spain',
    contract: {
      start: '2019-12',
      until: '2027-06',
    },
  }

  const baseTeam: ITeamJson = {
    id: 57,
    name: 'Arsenal FC',
    shortName: 'Arsenal',
    tla: 'ARS',
    crest: 'https://crests.football-data.org/57.png',
    venue: 'Emirates Stadium',
    founded: 1886,
    clubColors: 'Red / White',
    website: 'http://www.arsenal.com',
    coach: baseCoach,
    runningCompetitions: [
      {
        id: 2021,
        name: 'Premier League',
        code: 'PL',
        type: 'LEAGUE',
        emblem: 'https://crests.football-data.org/PL.png',
      },
      {
        id: 2001,
        name: 'UEFA Champions League',
        code: 'CL',
        type: 'CUP',
        emblem: 'https://crests.football-data.org/CL.png',
      },
    ],
    squad: [
      {
        id: 3189,
        name: 'Kepa Arrizabalaga',
        position: 'Goalkeeper',
        dateOfBirth: '1994-10-03',
        nationality: 'Spain',
      },
    ],
  }

  describe('constructor', () => {
    it('should construct team with all properties mapped correctly', () => {
      const team = new Team(baseTeam)

      expect(team.id).toBe(57)
      expect(team.name).toBe('Arsenal FC')
      expect(team.code).toBe('ARS')
      expect(team.shortName).toBe('Arsenal')
      expect(team.venue).toBe('Emirates Stadium')
      expect(team.founded).toBe(1886)
      expect(team.clubColors).toBe('Red / White')
      expect(team.website).toBe('http://www.arsenal.com')
      expect(team.coach).toEqual(baseCoach)
      expect(team.runningCompetitions).toHaveLength(2)
      expect(team.squad).toHaveLength(1)
    })

    it('should generate correct API links', () => {
      const team = new Team(baseTeam)

      expect(team.links.self).toBe('https://api.football-data.org/v4/teams/57')
      expect(team.links.matches).toBe('https://api.football-data.org/v4/teams/57/matches')
      expect(team.links.players).toBe('https://api.football-data.org/v4/teams/57/players')
    })

    it('should handle null venue gracefully', () => {
      const teamData = { ...baseTeam, venue: null }
      const team = new Team(teamData)

      expect(team.venue).toBeNull()
    })

    it('should handle null founded year gracefully', () => {
      const teamData = { ...baseTeam, founded: null }
      const team = new Team(teamData)

      expect(team.founded).toBeNull()
    })

    it('should handle null clubColors gracefully', () => {
      const teamData = { ...baseTeam, clubColors: null }
      const team = new Team(teamData)

      expect(team.clubColors).toBeNull()
    })

    it('should handle null website gracefully', () => {
      const teamData = { ...baseTeam, website: null }
      const team = new Team(teamData)

      expect(team.website).toBeNull()
    })

    it('should handle null coach gracefully', () => {
      const teamData = { ...baseTeam, coach: null }
      const team = new Team(teamData)

      expect(team.coach).toBeNull()
    })

    it('should handle all null metadata fields', () => {
      const teamData = {
        ...baseTeam,
        venue: null,
        founded: null,
        clubColors: null,
        website: null,
        coach: null,
      }
      const team = new Team(teamData)

      expect(team.venue).toBeNull()
      expect(team.founded).toBeNull()
      expect(team.clubColors).toBeNull()
      expect(team.website).toBeNull()
      expect(team.coach).toBeNull()
    })

    it('should handle empty squad array', () => {
      const teamData = { ...baseTeam, squad: [] }
      const team = new Team(teamData)

      expect(team.squad).toEqual([])
      expect(team.squad).toHaveLength(0)
    })

    it('should preserve squad data', () => {
      const team = new Team(baseTeam)

      expect(team.squad[0].name).toBe('Kepa Arrizabalaga')
      expect(team.squad[0].position).toBe('Goalkeeper')
      expect(team.squad[0].nationality).toBe('Spain')
    })

    it('should handle empty runningCompetitions array', () => {
      const teamData = { ...baseTeam, runningCompetitions: [] }
      const team = new Team(teamData)

      expect(team.runningCompetitions).toEqual([])
      expect(team.runningCompetitions).toHaveLength(0)
    })

    it('should preserve runningCompetitions data', () => {
      const team = new Team(baseTeam)

      expect(team.runningCompetitions[0].name).toBe('Premier League')
      expect(team.runningCompetitions[0].code).toBe('PL')
      expect(team.runningCompetitions[1].name).toBe('UEFA Champions League')
      expect(team.runningCompetitions[1].code).toBe('CL')
    })
  })
})
