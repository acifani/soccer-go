import pc from 'picocolors';
import Table from 'cli-table3';
import { IPlayerJson, Player } from '../models';
import { BaseTableBuilder } from './BaseTableBuilder';

export class PlayersTableBuilder extends BaseTableBuilder<IPlayerJson, Player> {
  public buildTableHeader(): Table.HorizontalTable {
    return new Table({
      head: [
        pc.bold('Name'),
        pc.bold('Jersey'),
        pc.bold('Position'),
        pc.bold('Nationality'),
        pc.bold('Date of Birth'),
      ],
      style: { border: [], head: [] },
    }) as Table.HorizontalTable;
  }
}
