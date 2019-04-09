export interface ILeague {
  code: string;
  name: string;
}

export const getLeagueByName = (name: string): ILeague => {
  const candidate = leagueCodes.find(l => l.name === name);
  if (candidate) {
    return candidate;
  }
  throw new Error('League not found');
};

export const getLeagueByCode = (code: string): ILeague => {
  const candidate = leagueCodes.find(l => l.code === code);
  if (candidate) {
    return candidate;
  }
  throw new Error('League not found');
};

export const leagueCodes: ILeague[] = [
  { code: 'BL1', name: '1. Bundesliga' },
  { code: 'BL2', name: '2. Bundesliga' },
  { code: 'BL3', name: '3. Bundesliga' },
  { code: 'DFB', name: 'Dfb-Cup' },
  { code: 'PL', name: 'Premier League' },
  { code: 'EL1', name: 'League One' },
  { code: 'ELC', name: 'Championship' },
  { code: 'FAC', name: 'FA-Cup' },
  { code: 'SA', name: 'Serie A' },
  { code: 'SB', name: 'Serie B' },
  { code: 'PD', name: 'Primera Division' },
  { code: 'SD', name: 'Segunda Division' },
  { code: 'CDR', name: 'Copa del Rey' },
  { code: 'FL1', name: 'Ligue 1' },
  { code: 'FL2', name: 'Ligue 2' },
  { code: 'DED', name: 'Eredivisie' },
  { code: 'PPL', name: 'Primeira Liga' },
  { code: 'GSL', name: 'Super League' },
  { code: 'CL', name: 'Champions-League' },
  { code: 'EL', name: 'UEFA-Cup' },
  { code: 'EC', name: 'European-Cup of Nations' },
  { code: 'WC', name: 'World-Cup' },
];
