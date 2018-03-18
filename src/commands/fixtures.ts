import { getLeagueByName } from '../constants/leagues';
import { Fixture } from '../models';
import * as api from './../api';

export const printMatchday = async (leagueName: string) => {
  const league = getLeagueByName(leagueName);
  console.log(league.name)
  const fixturesData = await api.getMatchday(league.code);
  const table = Fixture.buildTable(fixturesData);
  console.log(table.toString());
};
