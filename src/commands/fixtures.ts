import axios from 'axios';
import * as Table from 'cli-table2';
import cfg from '../config';
import { Fixture } from '../models';

export const matchday = (comp: string): void => {
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

  axios
    .get(
      `http://football-data.org/v1/fixtures/?league=${comp}`,
      cfg.axiosConfig
    )
    .then((fixtureRes: any): void => {
      fixtureRes.data.fixtures.forEach((fix: any) => {
        const fixture = new Fixture(fix);
        table.push(fixture.toRow());
      });

      console.log(table.toString());
    })
    .catch(err => console.log(err));
};
