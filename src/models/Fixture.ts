import c from 'chalk';
import Table from 'cli-table3';
import moment from 'moment';
import cfg from '../config';
import { IRowable } from '../tableBuilders/BaseTableBuilder';

export enum Status {
  Awarded = 'AWARDED',
  Canceled = 'CANCELED',
  Finished = 'FINISHED',
  InProgress = 'IN_PLAY',
  Paused = 'PAUSED',
  Postponed = 'POSTPONED',
  Scheduled = 'SCHEDULED',
  Suspended = 'SUSPENDED',
}

const statusDisplayString: Map<Status, string> = new Map([
  [Status.Awarded, 'Awarded'],
  [Status.Canceled, 'Canceled'],
  [Status.Finished, 'Finished'],
  [Status.InProgress, 'Playing'],
  [Status.Paused, 'Paused'],
  [Status.Postponed, 'Postponed'],
  [Status.Scheduled, 'Scheduled'],
  [Status.Suspended, 'Suspended'],
]);

export interface ISide {
  team: string;
  goals: number;
}

export interface IFixtureLinks {
  self: string;
  homeTeam: string;
  awayTeam: string;
}

export default class Fixture implements IRowable {
  public id: number;
  public home: ISide;
  public away: ISide;
  public matchday: number;
  public status: Status;
  public date: Date;
  public links: IFixtureLinks;

  constructor(data: IFixtureJson) {
    const [homeScore, awayScore] = this.getScores(data.score);

    this.id = data.id;
    this.home = {
      goals: homeScore,
      team: data.homeTeam.name,
    };
    this.away = {
      goals: awayScore,
      team: data.awayTeam.name,
    };
    this.matchday = data.matchday;
    this.status = data.status;
    this.date = new Date(data.utcDate);
    this.links = {
      awayTeam: `${cfg.apiBaseUrl}/teams/${data.awayTeam.id}`,
      homeTeam: `${cfg.apiBaseUrl}/teams/${data.homeTeam.id}`,
      self: `${cfg.apiBaseUrl}/matches/${data.id}`,
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

  private getScores(score: IFixtureJson['score']): [number, number] {
    if (score.penalties.homeTeam != null) {
      return [score.penalties.homeTeam, score.penalties.awayTeam];
    }
    if (score.extraTime.homeTeam != null) {
      return [score.extraTime.homeTeam, score.extraTime.awayTeam];
    }
    if (score.fullTime.homeTeam != null) {
      return [score.fullTime.homeTeam, score.fullTime.awayTeam];
    }
    if (score.halfTime.homeTeam != null) {
      return [score.halfTime.homeTeam, score.halfTime.awayTeam];
    }

    return [0, 0];
  }
}

export interface IFixtureJson {
  id: number;
  utcDate: Date;
  status: Status;
  matchday: number;
  homeTeam: ITeamSide;
  awayTeam: ITeamSide;
  score: {
    winner: string;
    duration: string;
    fullTime: IScore;
    halfTime: IScore;
    extraTime: IScore;
    penalties: IScore;
  };
}

interface ITeamSide {
  id: number;
  name: string;
}

interface IScore {
  homeTeam: number;
  awayTeam: number;
}
