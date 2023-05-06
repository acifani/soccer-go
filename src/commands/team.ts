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

  if (options.includes('Fixtures')) {
    const fixturesData = await api.getTeamFixtures(team)
    const table = new FixturesTableBuilder().buildTable(fixturesData, Fixture)
    cfonts.say(team.shortName || team.name)
    console.log(table.toString())
  } else {
    cfonts.say(team.shortName || team.name)
  }

  if (options.includes('Players')) {
    const table = new PlayersTableBuilder().buildTable(team.squad, Player)
    console.log(table.toString())
  }
}

async function fetchTeam(team: string, league: string): Promise<Team> {
  const teamId = await api.getTeamId(team, league)
  const teamData = await api.getTeam(teamId)
  return new Team(teamData)
}
