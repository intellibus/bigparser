// Imports
import axios, { AxiosResponse } from 'axios';
import {
  DataType,
  JoinOperator,
  GlobalFilterOperator,
  ColumnFilterOperator,
  GlobalFilter,
  ColumnFilter,
  Filter,
  SortType,
  Pagination,
  Query,
  RowEntry,
  Insert,
  InsertObject,
  QueryObject,
  Distinct,
  QueryDistinctObject,
  QueryUpdate,
  QueryUpdateObject,
  UpdateRowId,
  UpdateRowIds,
  UpdateRowIdObject,
  UpdateColumnDatatype,
  UpdateColumnDatatypeObject,
  DeleteQueryObject,
  RowId,
  DeleteRowIds,
  DeleteRowIdObject,
  APIResponse,
} from './types';

// Package Functionality
const getAPIURL = (qa?: boolean) =>
  `https://${
    (qa != null && qa) || process.env.BP_QA ? 'qa' : 'www'
  }.bigparser.com/api/v2`;

const config = {
  headers: {
    authId: `${process.env.BP_AUTH}`,
  },
};

function gridURL(
  action: string,
  gridId: string,
  viewId?: string,
  qa?: boolean
): string {
  return `${getAPIURL(qa)}/grid/${
    viewId ? `${gridId}/share/${viewId}` : `${gridId}`
  }/${action}`;
}

async function to(promise: Promise<AxiosResponse>): Promise<APIResponse> {
  return promise
    .then((response: AxiosResponse) => ({
      ...response,
      error: undefined,
    }))
    .catch((err: Error) => ({ error: err, data: undefined }));
}

function createMethod<RequestDataType>(restMethod, action) {
  switch (restMethod) {
    case 'delete':
      return async (
        req: RequestDataType,
        gridId: string,
        viewId?: string,
        ...args
      ) =>
        to(
          axios[`${restMethod}`](
            gridURL(action, gridId, viewId, args[1]),
            args[0] != null
              ? { headers: { authId: args[0] }, data: req }
              : { ...config, data: req }
          )
        );
    case 'get':
      return async (
        req: RequestDataType,
        gridId: string,
        viewId?: string,
        ...args
      ) =>
        to(
          axios[`${restMethod}`](
            gridURL(action, gridId, viewId, args[1]),
            args[0] != null ? { headers: { authId: args[0] } } : { ...config }
          )
        );
    default:
      return async (
        req: RequestDataType,
        gridId: string,
        viewId?: string,
        ...args
      ) =>
        to(
          axios[`${restMethod}`](
            gridURL(action, gridId, viewId, args[1]),
            req,
            args[0] != null ? { headers: { authId: args[0] } } : config
          )
        );
  }
}

export async function search<GridDataModel>(
  ...args: [QueryObject<GridDataModel>, string, string?, string?, boolean?]
) {
  return createMethod('post', 'search')(...args);
}

export async function searchCount<GridDataModel>(
  ...args: [QueryObject<GridDataModel>, string, string?, string?, boolean?]
) {
  return createMethod('post', 'search_count')(...args);
}

export async function searchDistinct<GridDataModel>(
  ...args: [
    QueryDistinctObject<GridDataModel>,
    string,
    string?,
    string?,
    boolean?
  ]
) {
  return createMethod('post', 'distinct')(...args);
}

export async function insert<GridDataModel>(
  ...args: [InsertObject<GridDataModel>, string, string?, string?, boolean?]
) {
  return createMethod('post', 'rows/create')(...args);
}

export async function updateByQuery<GridDataModel>(
  ...args: [
    QueryUpdateObject<GridDataModel>,
    string,
    string?,
    string?,
    boolean?
  ]
) {
  return createMethod('put', 'rows/update_by_queryObj')(...args);
}

export async function updateByRowId<GridDataModel>(
  ...args: [
    UpdateRowIdObject<GridDataModel>,
    string,
    string?,
    string?,
    boolean?
  ]
) {
  return createMethod('put', 'rows/update_by_rowIds')(...args);
}

export async function updateColumnDatatype<GridDataModel>(
  ...args: [
    UpdateColumnDatatypeObject<GridDataModel>,
    string,
    string?,
    string?,
    boolean?
  ]
) {
  return createMethod('put', 'update_column_datatype')(...args);
}

export async function deleteByQuery<GridDataModel>(
  ...args: [
    DeleteQueryObject<GridDataModel>,
    string,
    string?,
    string?,
    boolean?
  ]
) {
  return createMethod('delete', 'rows/delete_by_queryObj')(...args);
}

export async function deleteByRowId(
  ...args: [DeleteRowIdObject, string, string?, string?, boolean?]
) {
  return createMethod('delete', 'rows/delete_by_rowIds')(...args);
}

export async function getHeaders(
  ...args: [void, string, string?, string?, boolean?]
) {
  return createMethod('get', 'query_metadata')(...args);
}

export async function getMultisheetMetadata(
  ...args: [void, string, string?, string?, boolean?]
) {
  return createMethod('get', 'query_multisheet_metadata')(...args);
}

export {
  DataType,
  JoinOperator,
  GlobalFilterOperator,
  ColumnFilterOperator,
  GlobalFilter,
  ColumnFilter,
  Filter,
  SortType,
  Pagination,
  Query,
  RowEntry,
  Insert,
  InsertObject,
  QueryObject,
  Distinct,
  QueryDistinctObject,
  QueryUpdate,
  QueryUpdateObject,
  UpdateRowId,
  UpdateRowIds,
  UpdateRowIdObject,
  UpdateColumnDatatype,
  UpdateColumnDatatypeObject,
  DeleteQueryObject,
  RowId,
  DeleteRowIds,
  DeleteRowIdObject,
  APIResponse,
};
