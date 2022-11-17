import cfonts from 'cfonts'
import * as api from '../api'
import { getLeagueByCode } from '../constants/leagues'
import { Fixture } from '../models'
import { FixturesTableBuilder } from '../tableBuilders'

export const printMatchday = async (leagueCode: string): Promise<void> => {
  const league = getLeagueByCode(leagueCode)
  cfonts.say(league.name)
  const fixturesData = await api.getMatchday(league.code)
  const table = new FixturesTableBuilder().buildTable(fixturesData, Fixture)
  console.log(table.toString())
}
