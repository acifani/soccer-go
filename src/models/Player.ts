import { Cell } from 'cli-table2';

export default class Player {
  public name: string;
  public position: string;
  public jerseyNumber: string;
  public dateOfBirth: string;
  public nationality: string;

  constructor(data: any) {
    Object.assign(this, data);
  }

  public toRow = (): Cell[] => [
    this.name,
    this.jerseyNumber,
    this.position,
    this.nationality,
    this.dateOfBirth,
  ];
}
