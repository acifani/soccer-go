import cfonts from 'cfonts'
import pc from 'picocolors'
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
  printTeamDetails(team)

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

function printTeamDetails(team: Team): void {
  // Header with full name
  console.log(pc.cyan(pc.bold(`\n📋 ${team.name}`)))
  console.log(pc.dim('─'.repeat(60)))

  const infoItems: string[] = []

  if (team.founded) {
    infoItems.push(`${pc.yellow('⚡')} Founded ${pc.bold(team.founded.toString())}`)
  }

  if (team.venue) {
    infoItems.push(`${pc.green('🏟️ ')} ${team.venue}`)
  }

  if (team.clubColors) {
    infoItems.push(`${pc.magenta('🎨')} ${team.clubColors}`)
  }

  if (infoItems.length > 0) {
    console.log(infoItems.join(pc.dim(' • ')))
  }

  const secondLine: string[] = []

  if (team.website) {
    const cleanWebsite = team.website.replace(/^https?:\/\//, '').replace(/\/$/, '')
    secondLine.push(`${pc.blue('🌐')} ${cleanWebsite}`)
  }

  if (team.coach) {
    const contractEnd = team.coach.contract.until
    secondLine.push(`${pc.cyan('👤')} ${team.coach.name} ${pc.dim(`(until ${contractEnd})`)}`)
  }

  if (secondLine.length > 0) {
    console.log(secondLine.join(pc.dim(' • ')))
  }

  if (team.runningCompetitions?.length > 0) {
    const competitions = team.runningCompetitions.map((c) => pc.bold(c.name)).join(pc.dim(', '))
    console.log(`${pc.yellow('🏆')} ${competitions}`)
  }

  console.log(pc.dim('─'.repeat(60)))
  console.log()
}

async function fetchTeam(team: string, league: string): Promise<Team> {
  const teamId = await api.getTeamId(team, league)
  const teamData = await api.getTeam(teamId)
  return new Team(teamData)
}
