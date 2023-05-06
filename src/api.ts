import dayjs from 'dayjs'
import { createSpinner } from 'nanospinner'
import { cachedApiCall } from './cache'
import cfg from './config'
import { IFixtureJson, IStandingsJson, ITeamJson, Team } from './models'
import { ApplicationError, ErrorCode } from './utils/errors'

export async function getMatchday(leagueCode: string): Promise<IFixtureJson[]> {
  const start = dayjs().subtract(3, 'day').format('YYYY-MM-DD')
  const end = dayjs().add(4, 'days').format('YYYY-MM-DD')
  const data = await callApi(
    `${cfg.apiBaseUrl}/competitions/${leagueCode}/matches?dateFrom=${start}&dateTo=${end}`,
    'Fetching matchday...',
    cfg.cache.expiry.fixtures,
  )
  return data.matches
}

export async function getTeam(teamId: number): Promise<ITeamJson> {
  return callApi(`${cfg.apiBaseUrl}/teams/${teamId}`, 'Fetching team...', cfg.cache.expiry.team)
}

export async function getTeamFixtures(team: Team): Promise<IFixtureJson[]> {
  const data = await callApi(
    team.links.matches,
    'Fetching team fixtures...',
    cfg.cache.expiry.fixtures,
  )
  return data.matches
}

export async function getCompetitionTeams(leagueCode: string): Promise<ITeamJson[]> {
  const data = await callApi(
    `${cfg.apiBaseUrl}/competitions/${leagueCode}/teams`,
    'Fetching teams...',
    cfg.cache.expiry.competition,
  )
  return data.teams
}

export async function getStandings(leagueCode: string): Promise<IStandingsJson[]> {
  const data = await callApi(
    `${cfg.apiBaseUrl}/competitions/${leagueCode}/standings`,
    'Fetching standings...',
    cfg.cache.expiry.standings,
  )
  return data.standings?.filter((s: IStandingsJson) => s.type === 'TOTAL')
}

export async function getTeamId(teamName: string, leagueCode: string): Promise<number> {
  const teams = await getCompetitionTeams(leagueCode)
  const team = teams.find((t) => t.name.toLowerCase().includes(teamName.toLowerCase().trim()))
  if (team == null) {
    throw new Error('Team not found.')
  }
  return team.id
}

async function callApi(url: string, placeholder: string, expiry: number): Promise<any> {
  if (!cfg.authToken) {
    apiKeyError()
  }

  const spinner = createSpinner(placeholder).start()
  try {
    const response = await cachedApiCall(url, cfg.authToken, expiry)
    spinner.success().clear()
    return response
  } catch (error) {
    spinner.error()
    throw error
  }
}

function apiKeyError(): void {
  if (process.env.CI) {
    return
  }

  throw new ApplicationError(ErrorCode.API_KEY_MISSING)
}
