import * as Table from 'cli-table3';
import * as moment from 'moment';
import { IRowable } from '../tableBuilders/BaseTableBuilder';

export default class Player implements IRowable {
  public name: string;
  public position: string;
  public jerseyNumber: number;
  public dateOfBirth: string;
  public nationality: string;

  constructor(data: IPlayerJson) {
    this.name = data.name;
    this.position = data.position;
    this.jerseyNumber = data.shirtNumber;
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
  id: number;
  name: string;
  position: string;
  shirtNumber: number;
  dateOfBirth: string;
  nationality: string;
}
