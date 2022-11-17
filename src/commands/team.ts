import cfonts from 'cfonts'
import * as api from '../api'
import { Fixture, Player, Team } from '../models'
import { FixturesTableBuilder, PlayersTableBuilder } from '../tableBuilders'

export const printTeam = async (
  teamName: string,
  options: string[],
  leagueCode: string,
): Promise<void> => {
  const team = await fetchTeam(teamName, leagueCode)
  cfonts.say(team.shortName || team.name)

  if (options.includes('Fixtures')) {
    const fixturesData = await api.getTeamFixtures(team)
    const table = new FixturesTableBuilder().buildTable(fixturesData, Fixture)
    console.log(table.toString())
  }

  if (options.includes('Players')) {
    const table = new PlayersTableBuilder().buildTable(team.squad, Player)
    console.log(table.toString())
  }
}

async function fetchTeam(team: string, league: string): Promise<Team> {
  try {
    const teamId = await api.getTeamId(team, league)
    const teamData = await api.getTeam(teamId)
    return new Team(teamData)
  } catch (error: any) {
    console.log(error.message)
    process.exit(1)
  }
}
