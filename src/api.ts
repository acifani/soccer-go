import * as moment from 'moment';
import * as ora from 'ora';
import { cachedApiCall } from './cache';
import cfg from './config';
import {
  Competition,
  ICompetitionJson,
  IFixtureJson,
  IPlayerJson,
  IStandingJson,
  ITeamJson,
  Team,
} from './models';

export const getMatchday = async (
  leagueCode: string
): Promise<IFixtureJson[]> => {
  const start = moment()
    .subtract(3, 'day')
    .format('YYYY-MM-DD');
  const end = moment()
    .add(3, 'days')
    .format('YYYY-MM-DD');
  const data = await callApi(
    `${cfg.apiBaseUrl}/competitions/${leagueCode}` +
      `/matches?dateFrom=${start}&dateTo=${end}`,
    'Fetching matchday...',
    cfg.cache.expiry.fixtures
  );
  return data.matches;
};

export const getTeam = async (teamId: number): Promise<ITeamJson> =>
  callApi(
    `${cfg.apiBaseUrl}/teams/${teamId}`,
    'Fetching team...',
    cfg.cache.expiry.team
  );

export const getTeamFixtures = async (team: Team): Promise<IFixtureJson[]> => {
  const data = await callApi(
    team.links.matches,
    'Fetching team fixtures...',
    cfg.cache.expiry.fixtures
  );
  return data.matches;
};

export const getTeamPlayers = async (team: Team): Promise<IPlayerJson[]> => {
  const compareJerseyNumber = (a: IPlayerJson, b: IPlayerJson) =>
    a.shirtNumber > b.shirtNumber ? 1 : -1;

  const data = await callApi(
    team.links.self,
    'Fetching team players...',
    cfg.cache.expiry.players
  );
  return data.squad.sort(compareJerseyNumber);
};

export const getCompetition = async (
  leagueCode: string
): Promise<ICompetitionJson | undefined> => {
  const data = await callApi(
    `${cfg.apiBaseUrl}/competitions`,
    'Fetching competition...',
    cfg.cache.expiry.competition
  );
  return data.competitions.find((c: ICompetitionJson) => c.code === leagueCode);
};

export const getCompetitionTeams = async (
  comp: Competition
): Promise<ITeamJson[]> => {
  const data = await callApi(
    comp.links.teams,
    'Fetching teams...',
    cfg.cache.expiry.competition
  );
  return data.teams;
};

export const getStandings = async (
  leagueCode: string
): Promise<IStandingJson[]> => {
  const data = await callApi(
    `${cfg.apiBaseUrl}/competitions/${leagueCode}/standings?standingType=TOTAL`,
    'Fetching standings...',
    cfg.cache.expiry.standings
  );
  return data.standings[0].table;
};

export const getTeamId = async (
  teamName: string,
  leagueCode: string
): Promise<number> => {
  const comp = await getCompetition(leagueCode);
  if (comp == null) {
    throw new Error('Competition not found.');
  }
  const teams = await getCompetitionTeams(new Competition(comp));
  const team = teams.find(t =>
    t.name.toLowerCase().includes(teamName.toLowerCase().trim())
  );
  if (team == null) {
    throw new Error('Team not found.');
  }
  return team.id;
};

const callApi = async (
  url: string,
  placeholder: string,
  expiry: number
): Promise<any> => {
  if (cfg.axiosConfig.headers['X-Auth-Token'] == null) {
    apiKeyError();
  }

  const spinner = ora(placeholder).start();
  try {
    const response = await cachedApiCall(url, cfg.axiosConfig, expiry);
    spinner.stop();
    return response;
  } catch (error) {
    spinner.fail();
    handleError(error);
  }
};

const handleError = (error: any): void => {
  if (error.response) {
    console.log(error.response.data.error);
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

function apiKeyError() {
  if (process.env.CI) {
    return;
  }

  console.error(`
  SOCCER_GO_API_KEY environment variable not set.

      $ export SOCCER_GO_API_KEY=<football_data_api_key>

  You can get your own API key over at
  https://www.football-data.org/client/register
  `);
  process.exit(1);
}
