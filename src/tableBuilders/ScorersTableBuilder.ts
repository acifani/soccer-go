import pc from 'picocolors'
import Table from 'cli-table3'
import Scorer, { IScorerJson } from '../models/Scorer'
import { BaseTableBuilder } from './BaseTableBuilder'

export class ScorersTableBuilder extends BaseTableBuilder<IScorerJson, Scorer> {
  public buildTableHeader(): Table.GenericTable<Table.HorizontalTableRow> {
    return new Table({
      head: [
        pc.bold('#'),
        pc.bold('Player'),
        pc.bold('Team'),
        pc.bold('Goals'),
        pc.bold('Assists'),
        pc.bold('Penalties'),
        pc.bold('Matches'),
      ],
      style: { border: [], head: [] },
    }) as Table.GenericTable<Table.HorizontalTableRow>
  }
}
