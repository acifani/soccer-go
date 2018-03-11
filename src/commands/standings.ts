import { Answers } from 'inquirer';
import * as api from '../api';
import { Standing } from '../models';

export const get = (compName: string) => {
  (async () => {
    const standingsData = await api.getStandings(compName);
    const table = Standing.buildTable(standingsData);
    console.log(table.toString());
  })();
};
