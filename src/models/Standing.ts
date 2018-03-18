import * as Table from 'cli-table2';

export default class Standing {
  public static buildTable = (data: IStandingJson[]) => {
    const standings = data.map(s => new Standing(s).toRow());
    const table = Standing.buildTableHeader();
    table.push(...standings);
    return table;
  };

  private static buildTableHeader = () =>
    new Table({
      head: ['#', 'Club', 'MP', 'Pts', 'W', 'D', 'L', 'GF', 'GA', 'GD'],
      style: { border: [], head: [] },
    }) as Table.HorizontalTable;

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

  constructor(data: IStandingJson) {
    this.rank = data.position;
    this.team = data.teamName;
    this.playedGames = data.playedGames;
    this.points = data.points;
    this.goals = data.goals;
    this.goalsAgainst = data.goalsAgainst;
    this.goalDifference = data.goalDifference;
    this.wins = data.wins;
    this.draws = data.draws;
    this.losses = data.losses;
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
  ];
}

export interface IStandingJson {
  position: number;
  teamName: string;
  teamId: number;
  playedGames: number;
  crestURI: string;
  points: number;
  goals: number;
  goalsAgainst: number;
  goalDifference: number;
  wins: number;
  draws: number;
  losses: number;
}
