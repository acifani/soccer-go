import * as figlet from 'figlet';
import * as api from '../api';
import cfg from '../config';
import { getLeagueByCode } from '../constants/leagues';
import { Standing } from '../models';
import { StandingsTableBuilder } from '../tableBuilders';

export const printStandings = async (leagueCode: string) => {
  const league = getLeagueByCode(leagueCode);
  const leagueTitle = figlet.textSync(league.name, { font: cfg.figletFont });
  console.log(leagueTitle);
  const standingsData = await api.getStandings(leagueCode);
  const table = new StandingsTableBuilder().buildTable(standingsData, Standing);
  console.log(table.toString());
};
