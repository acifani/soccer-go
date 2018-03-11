import axios, { AxiosError, AxiosResponse } from 'axios';
import * as ora from 'ora';
import cfg from './config';
import { getLeagueByName } from './constants/leagues';
import {
  Competition,
  Fixture,
  ICompetitionJson,
  IFixtureJson,
  IPlayerJson,
  ITeamJson,
  Team,
} from './models';

export const getMatchday = async (
  leagueCode: string
): Promise<IFixtureJson[]> => {
  const data = await callApi(
    `${cfg.apiBaseUrl}/fixtures?league=${leagueCode}`,
    'Fetching matchday...'
  );
  return data.fixtures;
};

export const getTeam = async (teamId: number): Promise<ITeamJson> =>
  callApi(`${cfg.apiBaseUrl}/teams/${teamId}`, 'Fetching team...');

export const getTeamFixtures = async (team: Team): Promise<IFixtureJson[]> => {
  const data = await callApi(team.links.fixtures, 'Fetching team fixtures...');
  return data.fixtures;
};

export const getTeamPlayers = async (team: Team): Promise<IPlayerJson[]> => {
  const data = await callApi(team.links.players, 'Fetching team players...');
  return data.players;
};

export const getCompetition = async (
  leagueCode: string
): Promise<ICompetitionJson | undefined> => {
  const data: ICompetitionJson[] = await callApi(
    `${cfg.apiBaseUrl}/competitions`,
    'Fetching competition...'
  );
  return data.find(c => c.league === leagueCode);
};

export const getCompetitionTeams = async (
  comp: Competition
): Promise<ITeamJson[]> => {
  const data = await callApi(comp.links.teams, 'Fetching teams...');
  return data.teams;
};

export const getTeamId = async (
  teamName: string,
  compName: string
): Promise<number> => {
  const league = getLeagueByName(compName);
  const comp = await getCompetition(league.code);
  if (comp == null) {
    throw new Error('Competition not found.');
  }
  const teams = await getCompetitionTeams(new Competition(comp));
  const team = teams.find(t =>
    t.name.toLowerCase().includes(teamName.toLowerCase())
  );
  if (team == null) {
    throw new Error('Team not found.');
  }
  const stringId = team._links.self.href.split('/').pop();
  return Number(stringId);
};

const callApi = async (url: string, placeholder: string): Promise<any> => {
  try {
    const spinner = ora(placeholder).start();
    const response = await axios.get(url, cfg.axiosConfig);
    spinner.stop();
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error: any): void => {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
  } else if (error.request) {
    console.log(error.request);
  } else if (error.message) {
    console.log('Error', error.message);
  } else {
    console.log(error);
  }
  process.exit(1);
};
