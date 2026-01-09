import cfonts from 'cfonts'
import pc from 'picocolors'
import * as api from '../api'
import { getLeagueByCode } from '../constants/leagues'
import { Standing } from '../models'
import { StandingsTableBuilder } from '../tableBuilders'

export const printStandings = async (leagueCode: string): Promise<void> => {
  const league = getLeagueByCode(leagueCode)
  const standingsData = await api.getStandings(leagueCode)
  cfonts.say(league.name)
  for (const standing of standingsData) {
    if (standing.group) {
      console.log('\n' + pc.bold(standing.group))
    }

    const table = new StandingsTableBuilder().buildTable(standing.table, Standing)
    console.log(table.toString())
  }
}
