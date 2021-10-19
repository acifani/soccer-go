import c from 'chalk';
import Table from 'cli-table3';
import { Fixture, IFixtureJson } from '../models';
import { BaseTableBuilder } from './BaseTableBuilder';

export class FixturesTableBuilder extends BaseTableBuilder<
  IFixtureJson,
  Fixture
> {
  public buildTableHeader(): Table.HorizontalTable {
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
