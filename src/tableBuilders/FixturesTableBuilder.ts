import pc from 'picocolors'
import Table from 'cli-table3'
import { Fixture, IFixtureJson } from '../models'
import { BaseTableBuilder } from './BaseTableBuilder'

export class FixturesTableBuilder extends BaseTableBuilder<IFixtureJson, Fixture> {
  public buildTableHeader(): Table.HorizontalTable {
    return new Table({
      head: [
        pc.bold('Home - Away'),
        pc.bold('Score'),
        pc.bold('Status'),
        pc.bold('Date'),
        pc.bold('Stage'),
      ],
      style: { head: [], border: [] },
    }) as Table.HorizontalTable
  }
}
