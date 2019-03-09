import cfg from '../config';

export interface ITeamLinks {
  self: string;
  matches: string;
  players: string;
}

export default class Team {
  public id: number;
  public name: string;
  public code: string;
  public shortName: string | null;
  public links: ITeamLinks;

  constructor(data: ITeamJson) {
    const baseLink = `${cfg.apiBaseUrl}/teams/${data.id}`;

    this.id = data.id;
    this.name = data.name;
    this.code = data.tla;
    this.shortName = data.shortName;
    this.links = {
      matches: `${baseLink}/matches`,
      players: `${baseLink}/players`,
      self: baseLink,
    };
  }

  public print = (): void => {
    console.log('[' + this.code + '] ' + this.name);
  };
}

export interface ITeamJson {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crestUrl: string;
  venue: string;
}
