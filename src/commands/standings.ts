// tslint:disable-next-line
const figlet = require('figlet');
import * as api from '../api';
import { Standing } from '../models';

export const printStandings = async (compName: string) => {
  const compTitle = figlet.textSync(compName, { font: 'slant' });
  console.log(compTitle);
  const standingsData = await api.getStandings(compName);
  const table = Standing.buildTable(standingsData);
  console.log(table.toString());
};
