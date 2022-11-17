import cfonts from 'cfonts'
import pc from 'picocolors'
import * as api from '../api'
import { getLeagueByCode } from '../constants/leagues'
import { Standing } from '../models'
import { StandingsTableBuilder } from '../tableBuilders'

export const printStandings = async (leagueCode: string): Promise<void> => {
  const league = getLeagueByCode(leagueCode)
  cfonts.say(league.name)
  const standingsData = await api.getStandings(leagueCode)
  for (const standing of standingsData) {
    if (standing.group) {
      const [, group] = standing.group.split('_')
      console.log('\n' + pc.bold('Group ' + group))
    }

    const table = new StandingsTableBuilder().buildTable(standing.table, Standing)
    console.log(table.toString())
  }
}
