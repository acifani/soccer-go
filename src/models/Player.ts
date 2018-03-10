import { Cell } from 'cli-table2';

export default class Player {
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

  public toRow = (): Cell[] => [
    this.name,
    this.jerseyNumber,
    this.position,
    this.nationality,
    this.dateOfBirth,
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
