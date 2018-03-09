import axios, { AxiosResponse } from 'axios';
import * as Table from 'cli-table2';
import * as ora from 'ora';
import cfg from '../config';
import { ILeague, leagueCodes } from '../constants/leagues';
import { Fixture } from '../models';

export const matchday = (leagueName: string): void => {
  (async () => {
    // TODO: print comp here

    const league = leagueCodes.find(l => l.name === leagueName);
    if (league == null) {
      console.log('Competition not found.');
      process.exit(1);
    }
    const leagueCode = league ? league.code : '';

    const table = new Table({
      head: ['Home - Away', 'Score', 'Status', 'Date'],
      style: { head: [], border: [] },
    }) as Table.HorizontalTable;

    try {
      const spinner = ora('Fetching fixtures...').start();
      const fixtureResponse: AxiosResponse = await axios.get(
        `${cfg.apiBaseUrl}/fixtures?league=${leagueCode}`
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
