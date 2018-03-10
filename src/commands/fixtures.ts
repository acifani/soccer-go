import axios, { AxiosResponse } from 'axios';
import * as Table from 'cli-table2';
import * as ora from 'ora';
import cfg from '../config';
import { ILeague, leagueCodes } from '../constants/leagues';
import { Fixture, IFixtureJson } from '../models';
import * as api from './../api';

export const matchday = (leagueName: string): void => {
  (async () => {
    // TODO: print comp here

    const league = leagueCodes.find(l => l.name === leagueName);
    if (league == null) {
      console.log('Competition not found.');
      process.exit(1);
    }

    const leagueCode = league ? league.code : '';
    const fixturesData = await api.getMatchday(leagueCode);
    const fixtures = fixturesData.map((f: IFixtureJson) =>
      new Fixture(f).toRow()
    );

    const table = Fixture.buildTable();
    table.push(...fixtures);

    console.log(table.toString());
  })();
};
