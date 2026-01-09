import cfonts from 'cfonts'
import * as api from '../api'
import { getLeagueByCode } from '../constants/leagues'
import { Fixture, FixtureDetails } from '../models'
import { FixturesTableBuilder, FixtureDetailsTableBuilder } from '../tableBuilders'

export const printMatchday = async (leagueCode: string, showDetails = false): Promise<void> => {
  const league = getLeagueByCode(leagueCode)
  const fixturesData = await api.getMatchday(league.code)
  cfonts.say(league.name)

  if (showDetails) {
    const table = new FixtureDetailsTableBuilder().buildTable(fixturesData, FixtureDetails)
    console.log(table.toString())
  } else {
    const table = new FixturesTableBuilder().buildTable(fixturesData, Fixture)
    console.log(table.toString())
  }
}
