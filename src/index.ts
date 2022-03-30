// API Constants
import axios, { AxiosResponse } from 'axios';

// BigParser Types
declare type BigParserRow = object;

declare type BigParserRows = Array<BigParserRow>;

declare interface BigParserData {
  rows: BigParserRows;
}

export declare interface APIResponse {
  data: {
    [name: string]: object;
  };
  status: number;
  statusText: string;
  headers: {
    [name: string]: object;
  };
}

declare type DataType = 'STRING' | 'NUMBER' | 'DATE' | 'DATE_TIME' | 'BOOLEAN';

declare type JoinOperator = 'OR' | 'AND';

declare type GlobalFilterOperator = 'LIKE' | 'NLIKE' | 'EQ' | 'NEQ';

declare type ColumnFilterOperator =
  | GlobalFilterOperator
  | 'GT'
  | 'GTE'
  | 'LT'
  | 'LTE'
  | 'IN';

declare interface GlobalFilter {
  operator?: GlobalFilterOperator;
  keyword: string;
}

declare interface ColumnFilter {
  column: string;
  operator?: ColumnFilterOperator;
  keyword: string;
}

declare interface Filter<T> {
  filters: Array<T>;
  filtersJoinOperator?: JoinOperator;
}

declare interface InsertObject {
  insert: BigParserData;
}

declare interface QueryObject {
  query: {
    globalFilter?: Filter<GlobalFilter>;
    columnFilter?: Filter<ColumnFilter>;
    globalColumnFilterJoinOperator?: JoinOperator;
    selectColumnNames?: Array<string>;
    sort?: {
      [name: string]: string;
    };
    pagination?: {
      startRow: number;
      rowCount: number;
    };
    sendRowIdsInResponse?: boolean;
    showColumnNamesInResponse?: boolean;
  };
}

declare interface QueryUpdateObject extends QueryObject {
  update: {
    columns: BigParserRow;
  };
}

declare interface QueryDistinctObject extends QueryObject {
  distinct: {
    columnNames?: Array<string>;
  };
}

declare interface UpdateObject {
  update: {
    rows: {
      rowId: string;
      columns: BigParserRow;
    }[];
  };
}

declare interface UpdateColumnDatatypeObject {
  columns: {
    columnName: string;
    dataType: DataType;
  }[];
}

const APIURL = `https://${
  process.env.BP_QA ? 'qa' : 'www'
}.bigparser.com/api/v2`;

const config = {
  headers: {
    authid: `${process.env.BP_AUTH}`,
  },
};

function gridURL(action: string, gridId: string, viewId?: string): string {
  return `${APIURL}/grid/${
    viewId ? `${gridId}/share/${viewId}` : `${gridId}`
  }/${action}`;
}

export async function search(
  queryObj: QueryObject,
  gridId: string,
  viewId?: string
): Promise<AxiosResponse> {
  return axios.post(gridURL('search', gridId, viewId), queryObj, config);
}
export async function searchCount(
  queryObj: QueryObject,
  gridId: string,
  viewId?: string
): Promise<AxiosResponse> {
  return axios.post(gridURL('search_count', gridId, viewId), queryObj, config);
}
export async function searchDistinct(
  queryDistinctObj: QueryDistinctObject,
  gridId: string,
  viewId?: string
): Promise<AxiosResponse> {
  return axios.post(
    gridURL('distinct', gridId, viewId),
    queryDistinctObj,
    config
  );
}
export async function insert(
  insertObj: InsertObject,
  gridId: string,
  viewId?: string
): Promise<AxiosResponse> {
  return axios.post(gridURL('rows/create', gridId, viewId), insertObj, config);
}
export async function updateByQuery(
  queryUpdateObj: QueryUpdateObject,
  gridId: string,
  viewId?: string
): Promise<AxiosResponse> {
  return axios.put(
    gridURL('rows/update_by_queryObj', gridId, viewId),
    queryUpdateObj,
    config
  );
}
export async function update(
  updateObj: UpdateObject,
  gridId: string,
  viewId?: string
): Promise<AxiosResponse> {
  return axios.put(
    gridURL('rows/update_by_rowIds', gridId, viewId),
    updateObj,
    config
  );
}
export async function updateColumnDatatype(
  updateColumnDatatypeObj: UpdateColumnDatatypeObject,
  gridId: string,
  viewId?: string
): Promise<AxiosResponse> {
  return axios.put(
    gridURL('update_column_datatype', gridId, viewId),
    updateColumnDatatypeObj,
    config
  );
}
export async function getHeaders(
  gridId: string,
  viewId?: string
): Promise<AxiosResponse> {
  return axios.get(gridURL('query_metadata', gridId, viewId), config);
}
export async function getMultisheetMetadata(
  gridId: string,
  viewId?: string
): Promise<AxiosResponse> {
  return axios.get(
    gridURL('query_multisheet_metadata', gridId, viewId),
    config
  );
}
export async function bulkCrud(obj: object, gridId: string, viewId?: string) {
  return axios.post(
    gridURL('rows_columns/bulk_crud', gridId, viewId),
    obj,
    config
  );
}
