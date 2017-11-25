import * as Chalk from 'chalk';
import { Cell } from 'cli-table2';
const chalk = Chalk.default;

export enum Status {
  InProgress = 'IN_PROGRESS',
  Finished = 'FINISHED',
  Timed = 'TIMED',
  Scheduled = 'SCHEDULED',
}

export interface ISide {
  team: string;
  goals: number;
}

export interface IFixtureLinks {
  self: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
}

export default class Fixture {
  public home: ISide;
  public away: ISide;
  public matchday: number;
  public status: Status;
  public date: Date;
  public links: IFixtureLinks;

  constructor(data: any) {
    this.home = {
      team: data.homeTeamName,
      goals: data.result.goalsHomeTeam,
    };
    this.away = {
      team: data.awayTeamName,
      goals: data.result.goalsAwayTeam,
    };
    this.matchday = data.matchday;
    this.status = data.status;
    this.date = new Date(data.date);
    this.links = {
      self: data._links.self.href,
      competition: data._links.competition.href,
      homeTeam: data._links.homeTeam.href,
      awayTeam: data._links.awayTeam.href,
    };
  }

  public toRow = (): Cell[] => [
    `${this.home.team} - ${this.away.team}`,
    [Status.InProgress, Status.Finished].includes(this.status)
      ? chalk.bold(`${this.home.goals} : ${this.away.goals}`)
      : '',
    this.status,
    this.date.toLocaleString(),
  ];
}
