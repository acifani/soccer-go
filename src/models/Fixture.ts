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

export enum Stage {
  Final = 'FINAL',
  ThirdPlace = 'THIRD_PLACE',
  SemiFinals = 'SEMI_FINALS',
  QuarterFinals = 'QUARTER_FINALS',
  Last16 = 'LAST_16',
  Last32 = 'LAST_32',
  Last64 = 'LAST_64',
  Round4 = 'ROUND_4',
  Round3 = 'ROUND_3',
  Round2 = 'ROUND_2',
  Round1 = 'ROUND_1',
  GroupStage = 'GROUP_STAGE',
  Preliminary_Round = 'PRELIMINARY_ROUND',
  Qualification = 'QUALIFICATION',
  QualificationRound1 = 'QUALIFICATION_ROUND_1',
  QualificationRound2 = 'QUALIFICATION_ROUND_2',
  QualificationRound3 = 'QUALIFICATION_ROUND_3',
  PlayoffRound = 'PLAYOFF_ROUND',
  PlayoffRound1 = 'PLAYOFF_ROUND_1',
  PlayoffRound2 = 'PLAYOFF_ROUND_2',
  Playoffs = 'PLAYOFFS',
  RegularSeason = 'REGULAR_SEASON',
  Clausura = 'CLAUSURA',
  Apertura = 'APERTURA',
  Championship = 'CHAMPIONSHIP',
  Relegation = 'RELEGATION',
  RelegationRound = 'RELEGATION_ROUND',
}

export const stageDisplayString: Record<Stage, string> = {
  FINAL: 'Final',
  THIRD_PLACE: 'Third place',
  SEMI_FINALS: 'Semi-finals',
  QUARTER_FINALS: 'Quarter-finals',
  LAST_16: 'Round of 16',
  LAST_32: 'Round of 32',
  LAST_64: 'Round of 64',
  ROUND_4: 'Round 4',
  ROUND_3: 'Round 3',
  ROUND_2: 'Round 2',
  ROUND_1: 'Round 1',
  GROUP_STAGE: 'Group stage',
  PRELIMINARY_ROUND: 'Preliminary round',
  QUALIFICATION: 'Qualifications',
  QUALIFICATION_ROUND_1: 'Qualifications R1',
  QUALIFICATION_ROUND_2: 'Qualifications R2',
  QUALIFICATION_ROUND_3: 'Qualifications R3',
  PLAYOFF_ROUND: 'Play-off round',
  PLAYOFF_ROUND_1: 'Play-off R1',
  PLAYOFF_ROUND_2: 'Play-off R2',
  PLAYOFFS: 'Play-offs',
  REGULAR_SEASON: 'Regular season',
  CLAUSURA: 'Clausura',
  APERTURA: 'Apertura',
  CHAMPIONSHIP: 'Championship',
  RELEGATION: 'Relegation',
  RELEGATION_ROUND: 'Relegation round',
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
  public matchday: number | null;
  public stage: Stage;
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
    this.stage = data.stage;
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
    statusDisplayString[this.status] ?? this.status,
    dayjs(this.date).format('ddd, MMM D YYYY h:mm A'),
    stageDisplayString[this.stage] ?? this.stage,
  ];

  private getScores(score: IFixtureJson['score']): [number, number] {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
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
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    return [0, 0];
  }
}

export interface IFixtureJson {
  id: number;
  utcDate: Date;
  status: Status;
  matchday: number | null;
  stage: Stage;
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
