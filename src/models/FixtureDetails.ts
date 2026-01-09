import Table from 'cli-table3'
import Fixture, { IFixtureJson } from './Fixture'

export default class FixtureDetails extends Fixture {
  constructor(data: IFixtureJson) {
    super(data)
  }

  public toRow(): Table.Cell[] {
    const baseRow = super.toRow()
    const referee = this.referee ? `${this.referee.name} (${this.referee.nationality})` : ''

    return [...baseRow, referee]
  }
}
