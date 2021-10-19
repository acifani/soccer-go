import c from 'chalk';
import Table from 'cli-table3';
import { IPlayerJson, Player } from '../models';
import { BaseTableBuilder } from './BaseTableBuilder';

export class PlayersTableBuilder extends BaseTableBuilder<IPlayerJson, Player> {
  public buildTableHeader(): Table.HorizontalTable {
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
