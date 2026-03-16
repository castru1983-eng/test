
export interface TableData {
  id: string;
  title: string;
  columns: string[];
  rows: string[][];
}

export interface PageData {
  id: string;
  name: string;
  tables: TableData[];
}

export enum TableActionType {
  ADD_ROW = 'ADD_ROW',
  ADD_COLUMN = 'ADD_COLUMN',
  REMOVE_ROW = 'REMOVE_ROW',
  REMOVE_COLUMN = 'REMOVE_COLUMN',
  UPDATE_CELL = 'UPDATE_CELL',
  UPDATE_HEADER = 'UPDATE_HEADER',
  UPDATE_TITLE = 'UPDATE_TITLE'
}
