import cfonts from 'cfonts'
import * as api from '../api'
import { getLeagueByCode } from '../constants/leagues'
import { Scorer } from '../models'
import { ScorersTableBuilder } from '../tableBuilders'

export const printScorers = async (leagueCode: string): Promise<void> => {
  const league = getLeagueByCode(leagueCode)
  const scorersData = await api.getScorers(leagueCode)
  cfonts.say(league.name)
  const table = new ScorersTableBuilder().buildTable(scorersData.scorers, Scorer)
  console.log(table.toString())
}
