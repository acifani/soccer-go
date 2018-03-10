import { ICompetitionJson } from './Competition';

export interface ICompetitionLinks {
  self: string;
  teams: string;
  fixtures: string;
  leagueTable: string;
}

export default class Competition {
  public id: number;
  public caption: string;
  public league: string;
  public year: string;
  public links: ICompetitionLinks;

  constructor(data: ICompetitionJson) {
    this.id = data.id;
    this.caption = data.caption;
    this.league = data.league;
    this.year = data.year;
    this.links = {
      fixtures: data._links.fixtures.href,
      leagueTable: data._links.fixtures.href,
      self: data._links.self.href,
      teams: data._links.teams.href,
    };
  }
}

export interface ICompetitionJson {
  _links: {
    self: {
      href: string;
    };
    teams: {
      href: string;
    };
    fixtures: {
      href: string;
    };
    leagueTable: {
      href: string;
    };
  };
  id: number;
  caption: string;
  league: string;
  year: string;
  currentMatchday: number;
  numberOfMatchdays: number;
  numberOfTeams: number;
  numberOfGames: number;
  lastUpdated: Date;
}
