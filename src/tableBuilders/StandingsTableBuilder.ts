import * as Chalk from 'chalk';
import * as Table from 'cli-table2';
import { IStandingJson, Standing } from '../models';
import { BaseTableBuilder } from './BaseTableBuilder';
const c = Chalk.default;

export class StandingsTableBuilder extends BaseTableBuilder<
  IStandingJson,
  Standing
> {
  public buildTableHeader() {
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
