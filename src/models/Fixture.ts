import * as Chalk from 'chalk';
import * as Table from 'cli-table2';
import * as moment from 'moment'
const chalk = Chalk.default;

export enum Status {
  InProgress = 'IN_PLAY',
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
  public static buildTable = (data: IFixtureJson[]) => {
    const table = Fixture.buildTableHeader();
    const fixtures = data.map(f => new Fixture(f).toRow());
    table.push(...fixtures);
    return table;
  };

  private static buildTableHeader = () =>
    new Table({
      head: ['Home - Away', 'Score', 'Status', 'Date'],
      style: { head: [], border: [] },
    }) as Table.HorizontalTable;

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
      ? chalk.bold(`${this.home.goals} - ${this.away.goals}`)
      : '',
    this.status,
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
