import cfonts from 'cfonts';
import * as api from '../api';
import { getLeagueByCode } from '../constants/leagues';
import { Standing } from '../models';
import { StandingsTableBuilder } from '../tableBuilders';

export const printStandings = async (leagueCode: string): Promise<void> => {
  const league = getLeagueByCode(leagueCode);
  cfonts.say(league.name);
  const standingsData = await api.getStandings(leagueCode);
  const table = new StandingsTableBuilder().buildTable(standingsData, Standing);
  console.log(table.toString());
};
