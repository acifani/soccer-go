import pc from 'picocolors';
import Table from 'cli-table3';
import dayjs from 'dayjs';
import cfg from '../config';
import { IRowable } from '../tableBuilders/BaseTableBuilder';

export enum Status {
  Scheduled = 'SCHEDULED',
  Timed = 'TIMED',
  InPlay = 'IN_PLAY',
  Paused = 'PAUSED',
  ExtraTime = 'EXTRA_TIME',
  Penalty = 'PENALTY_SHOOTOUT',
  Finished = 'FINISHED',
  Suspended = 'SUSPENDED',
  Postponed = 'POSTPONED',
  Cancelled = 'CANCELLED',
  Awarded = 'AWARDED',
}

const statusDisplayString: Record<Status, string> = {
  [Status.Awarded]: 'Awarded',
  [Status.Cancelled]: 'Canceled',
  [Status.Finished]: 'Finished',
  [Status.InPlay]: 'Playing',
  [Status.Paused]: 'Paused',
  [Status.Postponed]: 'Postponed',
  [Status.Scheduled]: 'Scheduled',
  [Status.Suspended]: 'Suspended',
  [Status.Timed]: 'Timed',
  [Status.ExtraTime]: 'Extra time',
  [Status.Penalty]: 'Penalties',
};

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
    [Status.InPlay, Status.Finished].includes(this.status)
      ? pc.bold(`${this.home.goals} - ${this.away.goals}`)
      : '',
    statusDisplayString[this.status],
    dayjs(this.date).format('ddd, MMM D YYYY h:mm A'),
  ];

  private getScores(score: IFixtureJson['score']): [number, number] {
    if (score.penalties?.home != null) {
      return [score.penalties.home, score.penalties.away!];
    }
    if (score.extraTime?.home != null) {
      return [score.extraTime.home, score.extraTime.away!];
    }
    if (score.fullTime.home != null) {
      return [score.fullTime.home, score.fullTime.away!];
    }
    if (score.halfTime.home != null) {
      return [score.halfTime.home, score.halfTime.away!];
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
    winner: string | null;
    duration: string;
    fullTime: IScore;
    halfTime: IScore;
    extraTime?: IScore;
    penalties?: IScore;
  };
}

interface ITeamSide {
  id: number;
  name: string;
}

interface IScore {
  home: number | null;
  away: number | null;
}
