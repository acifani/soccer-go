// tslint:disable-next-line
const figlet = require('figlet');
import * as api from '../api';
import { getLeagueByCode } from '../constants/leagues';
import { Standing } from '../models';
import { StandingsTableBuilder } from '../tableBuilders';

export const printStandings = async (leagueCode: string) => {
  const league = getLeagueByCode(leagueCode);
  const leagueTitle = figlet.textSync(league.name, { font: 'Slant' });
  console.log(leagueTitle);
  const standingsData = await api.getStandings(leagueCode);
  const table = new StandingsTableBuilder().buildTable(standingsData, Standing);
  console.log(table.toString());
};
