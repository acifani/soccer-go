import * as Chalk from 'chalk';
import * as Table from 'cli-table2';
import * as moment from 'moment';
const c = Chalk.default;

export default class Player {
  public static buildTable = (data: IPlayerJson[]) => {
    const players = data.map(p => new Player(p).toRow());
    const table = Player.buildTableHeader();
    table.push(...players);
    return table;
  };

  private static buildTableHeader = () =>
    new Table({
      head: [
        c.bold('Name'),
        c.bold('Jersey'),
        c.bold('Position'),
        c.bold('Nationality'),
        c.bold('Date of Birth'),
      ],
      style: { border: [], head: [] },
    }) as Table.HorizontalTable;

  public name: string;
  public position: string;
  public jerseyNumber: number;
  public dateOfBirth: string;
  public nationality: string;

  constructor(data: IPlayerJson) {
    this.name = data.name;
    this.position = data.position;
    this.jerseyNumber = data.jerseyNumber;
    this.dateOfBirth = data.dateOfBirth;
    this.nationality = data.nationality;
  }

  public toRow = (): Table.Cell[] => [
    this.name,
    this.jerseyNumber,
    this.position,
    this.nationality,
    moment(this.dateOfBirth).format('L'),
  ];
}

export interface IPlayerJson {
  name: string;
  position: string;
  jerseyNumber: number;
  dateOfBirth: string;
  nationality: string;
  contractUntil: string;
  marketValue: string;
}
