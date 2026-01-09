import pc from 'picocolors'
import Table from 'cli-table3'
import { FixtureDetails } from '../models'
import { IFixtureJson } from '../models/Fixture'
import { BaseTableBuilder } from './BaseTableBuilder'

export class FixtureDetailsTableBuilder extends BaseTableBuilder<IFixtureJson, FixtureDetails> {
  public buildTableHeader(): Table.GenericTable<Table.HorizontalTableRow> {
    return new Table({
      head: [
        pc.bold('Home - Away'),
        pc.bold('Score'),
        pc.bold('Status'),
        pc.bold('Date'),
        pc.bold('Stage'),
        pc.bold('Referee'),
      ],
      style: { head: [], border: [] },
    }) as Table.GenericTable<Table.HorizontalTableRow>
  }
}
