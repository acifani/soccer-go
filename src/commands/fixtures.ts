import { getLeagueByName } from '../constants/leagues';
import { Fixture } from '../models';
import * as api from './../api';

export const matchday = (leagueName: string): void => {
  (async () => {
    // TODO: print comp here
    const league = getLeagueByName(leagueName);
    const fixturesData = await api.getMatchday(league.code);
    const table = Fixture.buildTable(fixturesData);
    console.log(table.toString());
  })();
};
