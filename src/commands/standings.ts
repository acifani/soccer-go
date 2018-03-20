// tslint:disable-next-line
const figlet = require('figlet');
import * as api from '../api';
import { Standing } from '../models';
import { StandingsTableBuilder } from '../tableBuilders';

export const printStandings = async (compName: string) => {
  const compTitle = figlet.textSync(compName, { font: 'Slant' });
  console.log(compTitle);
  const standingsData = await api.getStandings(compName);
  const table = new StandingsTableBuilder().buildTable(standingsData, Standing);
  console.log(table.toString());
};
