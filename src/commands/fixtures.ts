// tslint:disable-next-line
const figlet = require('figlet');
import * as api from '../api';
import { getLeagueByName } from '../constants/leagues';
import { Fixture } from '../models';

export const printMatchday = async (leagueName: string) => {
  const league = getLeagueByName(leagueName);
  const leagueTitle = figlet.textSync(leagueName, { font: 'slant' });
  console.log(leagueTitle);
  const fixturesData = await api.getMatchday(league.code);
  const table = Fixture.buildTable(fixturesData);
  console.log(table.toString());
};
