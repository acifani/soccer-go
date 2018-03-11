import * as api from '../api';
import { Standing } from '../models';

export const printStandings = async (compName: string) => {
  const standingsData = await api.getStandings(compName);
  const table = Standing.buildTable(standingsData);
  console.log(table.toString());
};
