import pc from 'picocolors'
import Table from 'cli-table3'
import { IStandingJson, Standing } from '../models'
import { BaseTableBuilder } from './BaseTableBuilder'

export class StandingsTableBuilder extends BaseTableBuilder<IStandingJson, Standing> {
  public buildTableHeader(): Table.GenericTable<Table.HorizontalTableRow> {
    return new Table({
      head: [
        pc.bold('#'),
        pc.bold('Club'),
        pc.bold('MP'),
        pc.bold('Pts'),
        pc.bold('W'),
        pc.bold('D'),
        pc.bold('L'),
        pc.bold('GF'),
        pc.bold('GA'),
        pc.bold('GD'),
        pc.bold('Form'),
      ],
      style: { border: [], head: [] },
    }) as Table.GenericTable<Table.HorizontalTableRow>
  }
}
