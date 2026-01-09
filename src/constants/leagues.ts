import { ApplicationError, ErrorCode } from '../utils/errors'

export interface ILeague {
  code: string
  name: string
  type: 'LEAGUE' | 'LEAGUE_CUP' | 'CUP' | 'PLAYOFFS'
  tier: 'FREE' | 'PAID' // FREE = TIER_ONE from API, PAID = TIER_TWO+
}

// TIER_ONE leagues are free, TIER_TWO requires paid API subscription
// Leagues from TIER_THREE and TIER_FOUR are not supported yet
export const leagueCodes: ILeague[] = [
  // TIER_ONE - Free (12 leagues)
  { code: 'PL', name: 'Premier League', type: 'LEAGUE', tier: 'FREE' },
  { code: 'ELC', name: 'Championship', type: 'LEAGUE', tier: 'FREE' },
  { code: 'PD', name: 'Primera Division', type: 'LEAGUE', tier: 'FREE' },
  { code: 'BL1', name: 'Bundesliga', type: 'LEAGUE', tier: 'FREE' },
  { code: 'SA', name: 'Serie A', type: 'LEAGUE', tier: 'FREE' },
  { code: 'FL1', name: 'Ligue 1', type: 'LEAGUE', tier: 'FREE' },
  { code: 'DED', name: 'Eredivisie', type: 'LEAGUE', tier: 'FREE' },
  { code: 'PPL', name: 'Primeira Liga', type: 'LEAGUE', tier: 'FREE' },
  { code: 'BSA', name: 'Brasileiro Serie A', type: 'LEAGUE', tier: 'FREE' },
  { code: 'CL', name: 'Champions League', type: 'CUP', tier: 'FREE' },
  { code: 'WC', name: 'World Cup', type: 'CUP', tier: 'FREE' },
  { code: 'EC', name: 'European Championship', type: 'CUP', tier: 'FREE' },
  // TIER_TWO - Paid (requires API subscription upgrade)
  { code: 'BL2', name: '2. Bundesliga', type: 'LEAGUE', tier: 'PAID' },
  { code: 'DFB', name: 'DFB-Pokal', type: 'CUP', tier: 'PAID' },
  { code: 'EL1', name: 'League One', type: 'LEAGUE', tier: 'PAID' },
  { code: 'FAC', name: 'FA Cup', type: 'CUP', tier: 'PAID' },
  { code: 'SB', name: 'Serie B', type: 'LEAGUE', tier: 'PAID' },
  { code: 'SD', name: 'Segunda Division', type: 'LEAGUE', tier: 'PAID' },
  { code: 'FL2', name: 'Ligue 2', type: 'LEAGUE', tier: 'PAID' },
  { code: 'EL', name: 'Europa League', type: 'CUP', tier: 'PAID' },
  { code: 'CLQ', name: 'Champions League Qualification', type: 'CUP', tier: 'PAID' },
  { code: 'MLS', name: 'MLS', type: 'LEAGUE', tier: 'PAID' },
  { code: 'ECF', name: "UEFA Women's Euro", type: 'CUP', tier: 'PAID' },
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
