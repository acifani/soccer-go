import axios, { AxiosResponse } from 'axios';
import * as Table from 'cli-table2';
import * as ora from 'ora';
import cfg from '../config';
import { Fixture } from '../models';

export const matchday = (comp: string): void => {
  (async () => {
    // TODO: print comp here

    const re: RegExp = /^(BL1|BL2|DFB|PL|EL1|ELC|FAC|SA|SB|PD|SD|CDR|FL1|FL2|DED|PPL|CL|EL|EC|WC)$/;
    if (comp.match(re) == null) {
      console.log(
        'Competition value must be one of BL1|BL2|DFB|PL|EL1|ELC|FAC|SA|SB|PD|SD|CDR|FL1|FL2|DED|PPL|CL|EL|EC|WC'
      );
      process.exit(1);
    }

    const table = new Table({
      head: ['Home - Away', 'Score', 'Status', 'Date'],
      style: { head: [], border: [] },
    }) as Table.HorizontalTable;

    try {
      const spinner = ora('Fetching fixtures...').start();
      const fixtureResponse: AxiosResponse = await axios.get(
        `${cfg.apiBaseUrl}/fixtures?league=${comp}`
      );
      spinner.stop();

      fixtureResponse.data.fixtures.forEach((fix: any) => {
        const fixture = new Fixture(fix);
        table.push(fixture.toRow());
      });

      console.log(table.toString());
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.error);
      } else {
        console.log(error);
      }
    }
  })();
};
