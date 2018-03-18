import * as Chalk from 'chalk';

const chalk = Chalk.default;

export interface ITeamLinks {
  self: string;
  fixtures: string;
  players: string;
}

export default class Team {
  public name: string;
  public code: string;
  public shortName: string | null;
  public links: ITeamLinks;

  constructor(data: ITeamJson) {
    this.name = data.name;
    this.code = data.code;
    this.shortName = data.shortName;
    this.links = {
      fixtures: data._links.fixtures.href,
      players: data._links.players.href,
      self: data._links.self.href,
    };
  }

  public print = (): void => {
    console.log('[' + this.code + '] ' + this.name);
  };
}

export interface ITeamJson {
  _links: {
    self: {
      href: string;
    };
    fixtures: {
      href: string;
    };
    players: {
      href: string;
    };
  };
  name: string;
  code: string;
  shortName: string;
  squadMarketValue: string;
  crestUrl: string;
}
