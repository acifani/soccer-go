import { ApplicationError, ErrorCode } from '../utils/errors'

export interface ILeague {
  code: string
  name: string
  type: 'LEAGUE' | 'LEAGUE_CUP' | 'CUP' | 'PLAYOFFS'
}

export const leagueCodes: ILeague[] = [
  { code: 'BL1', name: '1. Bundesliga', type: 'LEAGUE' },
  { code: 'BL2', name: '2. Bundesliga', type: 'LEAGUE' },
  { code: 'BL3', name: '3. Bundesliga', type: 'LEAGUE' },
  { code: 'DFB', name: 'Dfb-Cup', type: 'CUP' },
  { code: 'PL', name: 'Premier League', type: 'LEAGUE' },
  { code: 'EL1', name: 'League One', type: 'LEAGUE' },
  { code: 'ELC', name: 'Championship', type: 'LEAGUE' },
  { code: 'FAC', name: 'FA-Cup', type: 'CUP' },
  { code: 'SA', name: 'Serie A', type: 'LEAGUE' },
  { code: 'SB', name: 'Serie B', type: 'LEAGUE' },
  { code: 'PD', name: 'Primera Division', type: 'LEAGUE' },
  { code: 'SD', name: 'Segunda Division', type: 'LEAGUE' },
  { code: 'CDR', name: 'Copa del Rey', type: 'CUP' },
  { code: 'FL1', name: 'Ligue 1', type: 'LEAGUE' },
  { code: 'FL2', name: 'Ligue 2', type: 'LEAGUE' },
  { code: 'DED', name: 'Eredivisie', type: 'LEAGUE' },
  { code: 'PPL', name: 'Primeira Liga', type: 'LEAGUE' },
  { code: 'GSL', name: 'Super League', type: 'LEAGUE' },
  { code: 'BSA', name: 'Brasileiro Serie A', type: 'LEAGUE' },
  { code: 'CL', name: 'Champions League', type: 'CUP' },
  { code: 'EL', name: 'Europa League', type: 'CUP' },
  { code: 'UCL', name: 'Conference League', type: 'CUP' },
  { code: 'EC', name: 'European Championship', type: 'CUP' },
  { code: 'WC', name: 'World Cup', type: 'CUP' },
]

export const getLeagueByName = (name: string): ILeague => {
  const candidate = leagueCodes.find((l) => l.name === name)
  if (candidate) {
    return candidate
  }
  throw new ApplicationError(ErrorCode.LEAGUE_NOT_FOUND_BY_NAME, name)
}

export const getLeagueByCode = (code: string): ILeague => {
  const candidate = leagueCodes.find((l) => l.code === code)
  if (candidate) {
    return candidate
  }
  throw new ApplicationError(ErrorCode.LEAGUE_NOT_FOUND_BY_CODE, code)
}
