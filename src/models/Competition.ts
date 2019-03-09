import cfg from '../config';

export interface ICompetitionLinks {
  self: string;
  teams: string;
  fixtures: string;
  leagueTable: string;
}

export default class Competition {
  public id: number;
  public code: string;
  public caption: string;
  public links: ICompetitionLinks;

  constructor(data: ICompetitionJson) {
    const baseLink = `${cfg.apiBaseUrl}/competitions/${data.code}`;

    this.id = data.id;
    this.code = data.code;
    this.caption = data.name;
    this.links = {
      fixtures: `${baseLink}/matches`,
      leagueTable: `${baseLink}/standings`,
      self: baseLink,
      teams: `${baseLink}/teams`,
    };
  }
}

export interface ICompetitionJson {
  id: number;
  name: string;
  code: string;
}
