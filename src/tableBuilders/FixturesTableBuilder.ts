import * as Chalk from 'chalk';
import * as Table from 'cli-table2';
import { Fixture, IFixtureJson } from '../models';
import { BaseTableBuilder } from './BaseTableBuilder';
const c = Chalk.default;

export class FixturesTableBuilder extends BaseTableBuilder<
  IFixtureJson,
  Fixture
> {
  public buildTableHeader() {
    return new Table({
      head: [
        c.bold('Home - Away'),
        c.bold('Score'),
        c.bold('Status'),
        c.bold('Date'),
      ],
      style: { head: [], border: [] },
    }) as Table.HorizontalTable;
  }
}
