import * as figlet from 'figlet';
import * as api from '../api';
import cfg from '../config';
import { getLeagueByCode } from '../constants/leagues';
import { Fixture } from '../models';
import { FixturesTableBuilder } from '../tableBuilders';

export const printMatchday = async (leagueCode: string): Promise<void> => {
  const league = getLeagueByCode(leagueCode);
  const leagueTitle = figlet.textSync(league.name, { font: cfg.figletFont });
  console.log(leagueTitle);
  const fixturesData = await api.getMatchday(league.code);
  const table = new FixturesTableBuilder().buildTable(fixturesData, Fixture);
  console.log(table.toString());
};
