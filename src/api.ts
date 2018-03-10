import axios, { AxiosError, AxiosResponse } from 'axios';
import * as ora from 'ora';
import cfg from './config';
import { Team } from './models';

export const getMatchday = async (leagueCode: string) => {
  const data = await callApi(
    `${cfg.apiBaseUrl}/fixtures?league=${leagueCode}`,
    'Fetching matchday...'
  );
  return data.fixtures;
};

export const getTeam = async (teamCode: string) =>
  callApi(`${cfg.apiBaseUrl}/teams/${teamCode}`, 'Fetching team...');

export const getTeamFixtures = async (team: Team) => {
  const data = await callApi(team.links.fixtures, 'Fetching team fixtures...');
  return data.fixtures;
};

export const getTeamPlayers = async (team: Team) => {
  const data = await callApi(team.links.players, 'Fetching team players...');
  return data.players;
};

const callApi = async (url: string, placeholder: string) => {
  try {
    const spinner = ora(placeholder).start();
    const response: AxiosResponse = await axios.get(url, cfg.axiosConfig);
    spinner.stop();
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error: any) => {
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
};
