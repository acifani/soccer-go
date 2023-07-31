import Table from 'cli-table3'

export abstract class BaseTableBuilder<TJson, T extends IRowable> {
  public buildTable(data: TJson[], TClass: new (d: TJson) => T): Table.Table {
    const table = this.buildTableHeader()
    const rows = data.map((d) => new TClass(d).toRow())
    table.push(...rows)
    return table
  }

  public abstract buildTableHeader(): Table.Table
}

export interface IRowable {
  toRow(): Table.Cell[]
}
