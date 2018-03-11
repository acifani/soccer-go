import axios, { AxiosResponse } from 'axios';
import * as Table from 'cli-table2';
import * as ora from 'ora';
import cfg from '../config';
import { getLeagueByName, ILeague, leagueCodes } from '../constants/leagues';
import { Fixture, IFixtureJson } from '../models';
import * as api from './../api';

export const matchday = (leagueName: string): void => {
  (async () => {
    // TODO: print comp here
    const league = getLeagueByName(leagueName);
    const fixturesData = await api.getMatchday(league.code);
    const fixtures = fixturesData.map(f => new Fixture(f).toRow());

    const table = Fixture.buildTable();
    table.push(...fixtures);
    console.log(table.toString());
  })();
};
