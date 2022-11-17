import cfg from '../config';
import type { IPlayerJson } from './Player';

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
  public squad: IPlayerJson[];

  constructor(data: ITeamJson) {
    const baseLink = `${cfg.apiBaseUrl}/teams/${data.id}`;

    this.id = data.id;
    this.name = data.name;
    this.code = data.tla;
    this.shortName = data.shortName;
    this.squad = data.squad;
    this.links = {
      matches: `${baseLink}/matches`,
      players: `${baseLink}/players`,
      self: baseLink,
    };
  }
}

export interface ITeamJson {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  venue: string;
  clubColors: string;
  squad: IPlayerJson[];
}
