export declare interface TestGrid {
  _id: string;
  'String Column': string;
  'Number Column': number;
  'Number 2 Column': number;
  'Boolean Column': boolean;
  'Date Column': string;
  'Linked Column': string;
  'Linked Related Column From Other Grid': string;
  'Formula Column': number;
  'Empty Column': string;
}

export declare interface TestGridTab2 {
  _id: string;
  'Source Column': string;
  'Linked Related Column': string;
}

export declare interface NewGrid {
  _id: string;
  'Column 1': string;
  'Column 2': string;
  'Column 3': string;
  'Column 4': string;
  'Column 5': string;
}

export const TestGridObject = {
  'String Column': 'STRING',
  'Number Column': 'NUMBER',
  'Number 2 Column': 'NUMBER',
  'Boolean Column': 'BOOLEAN',
  'Date Column': 'DATE_TIME',
  'Linked Column': 'STRING',
  'Linked Related Column From Other Grid': 'STRING',
  'Formula Column': 'NUMBER',
  'Empty Column': 'STRING',
}

export const TestGridTab2Object = {
  'Source Column': 'STRING',
  'Linked Related Column': 'STRING'
}

export const NewGridObject = {
  'Column 1': 'STRING',
  'Column 2': 'STRING',
  'Column 3': 'STRING',
  'Column 4': 'STRING',
  'Column 5': 'STRING',
}