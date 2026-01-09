/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs'
import { createSpinner } from 'nanospinner'
import { cachedApiCall } from './cache'
import cfg from './config'
import { IFixtureJson, IStandingsJson, ITeamJson, Team } from './models'
import { ApplicationError, ErrorCode, isErrorNodeSystemError } from './utils/errors'

export async function getMatchday(leagueCode: string): Promise<IFixtureJson[]> {
  const start = dayjs().subtract(3, 'day').format('YYYY-MM-DD')
  const end = dayjs().add(4, 'days').format('YYYY-MM-DD')
  const data = (await callApi(
    `${cfg.apiBaseUrl}/competitions/${leagueCode}/matches?dateFrom=${start}&dateTo=${end}`,
    'Fetching matchday...',
    cfg.cache.expiry.fixtures,
  )) as any
  return data.matches
}

export async function getTeam(teamId: number): Promise<ITeamJson> {
  return callApi(
    `${cfg.apiBaseUrl}/teams/${teamId}`,
    'Fetching team...',
    cfg.cache.expiry.team,
  ) as Promise<ITeamJson>
}

export async function getTeamFixtures(team: Team): Promise<IFixtureJson[]> {
  const data = (await callApi(
    team.links.matches,
    'Fetching team fixtures...',
    cfg.cache.expiry.fixtures,
  )) as any
  return data.matches
}

export async function getCompetitionTeams(leagueCode: string): Promise<ITeamJson[]> {
  const data = (await callApi(
    `${cfg.apiBaseUrl}/competitions/${leagueCode}/teams`,
    'Fetching teams...',
    cfg.cache.expiry.competition,
  )) as any
  return data.teams
}

export async function getStandings(leagueCode: string): Promise<IStandingsJson[]> {
  const data = (await callApi(
    `${cfg.apiBaseUrl}/competitions/${leagueCode}/standings`,
    'Fetching standings...',
    cfg.cache.expiry.standings,
  )) as any
  return data.standings?.filter((s: IStandingsJson) => s.type === 'TOTAL')
}

export async function getTeamId(teamName: string, leagueCode: string): Promise<number> {
  const teams = await getCompetitionTeams(leagueCode)
  const team = teams.find((t) => t.name.toLowerCase().includes(teamName.toLowerCase().trim()))
  if (team == null) {
    throw new ApplicationError(ErrorCode.TEAM_NOT_FOUND, teamName)
  }
  return team.id
}

async function callApi(url: string, placeholder: string, expiry: number): Promise<unknown> {
  const spinner = createSpinner(placeholder).start()
  if (!cfg.authToken && !process.env.CI) {
    spinner.error()
    throw new ApplicationError(ErrorCode.API_KEY_MISSING)
  }

  try {
    const response = await cachedApiCall(url, cfg.authToken, expiry)
    spinner.success().clear()
    return response
  } catch (error: unknown) {
    spinner.error()
    if (
      isErrorNodeSystemError(error) &&
      error.code === 'ENOTFOUND' &&
      error.syscall === 'getaddrinfo'
    ) {
      throw new ApplicationError(ErrorCode.NETWORK_UNREACHABLE)
    }
    throw error
  }
}
