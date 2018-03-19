import * as Chalk from 'chalk';
import * as Table from 'cli-table2';
import { IPlayerJson, Player } from '../models';
import { BaseTableBuilder } from './BaseTableBuilder';
const c = Chalk.default;

export class PlayersTableBuilder extends BaseTableBuilder<IPlayerJson, Player> {
  public buildTableHeader() {
    return new Table({
      head: [
        c.bold('Name'),
        c.bold('Jersey'),
        c.bold('Position'),
        c.bold('Nationality'),
        c.bold('Date of Birth'),
      ],
      style: { border: [], head: [] },
    }) as Table.HorizontalTable;
  }
}
