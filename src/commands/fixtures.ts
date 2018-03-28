// tslint:disable-next-line
const figlet = require('figlet');
import * as api from '../api';
import { getLeagueByCode } from '../constants/leagues';
import { Fixture } from '../models';
import { FixturesTableBuilder } from '../tableBuilders';

export const printMatchday = async (leagueCode: string) => {
  const league = getLeagueByCode(leagueCode);
  const leagueTitle = figlet.textSync(league.name, { font: 'Slant' });
  console.log(leagueTitle);
  const fixturesData = await api.getMatchday(league.code);
  const table = new FixturesTableBuilder().buildTable(fixturesData, Fixture);
  console.log(table.toString());
};
