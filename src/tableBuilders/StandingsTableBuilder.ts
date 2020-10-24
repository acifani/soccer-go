import c from 'chalk';
import Table from 'cli-table3';
import { IStandingJson, Standing } from '../models';
import { BaseTableBuilder } from './BaseTableBuilder';

export class StandingsTableBuilder extends BaseTableBuilder<
  IStandingJson,
  Standing
> {
  public buildTableHeader(): Table.HorizontalTable {
    return new Table({
      head: [
        c.bold('#'),
        c.bold('Club'),
        c.bold('MP'),
        c.bold('Pts'),
        c.bold('W'),
        c.bold('D'),
        c.bold('L'),
        c.bold('GF'),
        c.bold('GA'),
        c.bold('GD'),
      ],
      style: { border: [], head: [] },
    }) as Table.HorizontalTable;
  }
}
