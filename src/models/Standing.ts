import Table from 'cli-table3';
import pc from 'picocolors';
import { IRowable } from '../tableBuilders/BaseTableBuilder';

export default class Standing implements IRowable {
  public rank: number;
  public team: string;
  public playedGames: number;
  public points: number;
  public goals: number;
  public goalsAgainst: number;
  public goalDifference: number;
  public wins: number;
  public draws: number;
  public losses: number;
  public form: string;

  constructor(data: IStandingJson) {
    this.rank = data.position;
    this.team = data.team.name;
    this.playedGames = data.playedGames;
    this.points = data.points;
    this.goals = data.goalsFor;
    this.goalsAgainst = data.goalsAgainst;
    this.goalDifference = data.goalDifference;
    this.wins = data.won;
    this.draws = data.draw;
    this.losses = data.lost;
    this.form = data.form;
  }

  public toRow = (): Table.Cell[] => [
    this.rank,
    this.team,
    this.playedGames,
    this.points,
    this.wins,
    this.draws,
    this.losses,
    this.goals,
    this.goalsAgainst,
    this.goalDifference,
    formatForm(this.form),
  ];
}

export interface IStandingJson {
  position: number;
  team: ITeam;
  playedGames: number;
  form: string;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

interface ITeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

const formatters = {
  W: pc.bgGreen,
  D: pc.bgYellow,
  L: pc.bgRed,
};

function formatForm(form: string): string {
  const results = form.split(',') as Array<'W' | 'D' | 'L'>;
  return results.map((r) => formatters[r](' ' + pc.bold(r) + ' ')).join(' ');
}
