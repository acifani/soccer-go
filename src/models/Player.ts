import Table from 'cli-table3'
import { IRowable } from '../tableBuilders/BaseTableBuilder'
import { formatPlayerDate } from '../utils/date-format'

export default class Player implements IRowable {
  public name: string
  public position: string
  public dateOfBirth: string
  public nationality: string

  constructor(data: IPlayerJson) {
    this.name = data.name
    this.position = data.position
    this.dateOfBirth = data.dateOfBirth
    this.nationality = data.nationality
  }

  public toRow = (): Table.Cell[] => [
    this.name,
    this.position,
    this.nationality,
    formatPlayerDate(this.dateOfBirth),
  ]
}

export interface IPlayerJson {
  id: number
  name: string
  position: string
  dateOfBirth: string
  nationality: string
}
