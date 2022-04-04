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