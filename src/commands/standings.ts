// tslint:disable-next-line
const figlet = require('figlet');
import * as api from '../api';
import { Standing } from '../models';
import { StandingsTableBuilder } from '../tableBuilders';

export const printStandings = async (leagueName: string) => {
  const leagueTitle = figlet.textSync(leagueName, { font: 'Slant' });
  console.log(leagueTitle);
  const standingsData = await api.getStandings(leagueName);
  const table = new StandingsTableBuilder().buildTable(standingsData, Standing);
  console.log(table.toString());
};
