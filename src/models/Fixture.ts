import * as Chalk from 'chalk';
import * as Table from 'cli-table2';
import * as moment from 'moment';
import { IRowable } from '../tableBuilders/BaseTableBuilder';
const c = Chalk.default;

export enum Status {
  InProgress = 'IN_PLAY',
  Finished = 'FINISHED',
  Timed = 'TIMED',
  Scheduled = 'SCHEDULED',
  Postponed = 'POSTPONED',
  Canceled = 'CANCELED',
}

const statusDisplayString: Map<Status, string> = new Map([
  [Status.InProgress, 'Playing'],
  [Status.Finished, 'Finished'],
  [Status.Timed, 'Timed'],
  [Status.Scheduled, 'Scheduled'],
  [Status.Postponed, 'Postponed'],
  [Status.Canceled, 'Canceled'],
]);

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

export default class Fixture implements IRowable {
  public home: ISide;
  public away: ISide;
  public matchday: number;
  public status: Status;
  public date: Date;
  public links: IFixtureLinks;

  constructor(data: IFixtureJson) {
    this.home = {
      goals: data.result.goalsHomeTeam,
      team: data.homeTeamName,
    };
    this.away = {
      goals: data.result.goalsAwayTeam,
      team: data.awayTeamName,
    };
    this.matchday = data.matchday;
    this.status = data.status;
    this.date = new Date(data.date);
    this.links = {
      awayTeam: data._links.awayTeam.href,
      competition: data._links.competition.href,
      homeTeam: data._links.homeTeam.href,
      self: data._links.self.href,
    };
  }

  public toRow = (): Table.Cell[] => [
    `${this.home.team} - ${this.away.team}`,
    [Status.InProgress, Status.Finished].includes(this.status)
      ? c.bold(`${this.home.goals} - ${this.away.goals}`)
      : '',
    statusDisplayString.get(this.status),
    moment(this.date).format('llll'),
  ];
}

export interface IFixtureJson {
  _links: {
    self: {
      href: string;
    };
    competition: {
      href: string;
    };
    homeTeam: {
      href: string;
    };
    awayTeam: {
      href: string;
    };
  };
  date: Date;
  status: Status;
  matchday: number;
  homeTeamName: string;
  awayTeamName: string;
  result: {
    goalsHomeTeam: number;
    goalsAwayTeam: number;
  };
}
