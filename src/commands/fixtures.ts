// tslint:disable-next-line
const figlet = require('figlet');
import * as api from '../api';
import { getLeagueByName } from '../constants/leagues';
import { Fixture } from '../models';
import { FixturesTableBuilder } from '../tableBuilders';

export const printMatchday = async (leagueName: string) => {
  const league = getLeagueByName(leagueName);
  const leagueTitle = figlet.textSync(leagueName, { font: 'Slant' });
  console.log(leagueTitle);
  const fixturesData = await api.getMatchday(league.code);
  const table = new FixturesTableBuilder().buildTable(fixturesData, Fixture);
  console.log(table.toString());
};
