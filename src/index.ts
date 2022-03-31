// API Constants
import axios, { AxiosResponse } from 'axios';

// BigParser Types
export declare type DataType =
  | 'STRING'
  | 'NUMBER'
  | 'DATE'
  | 'DATE_TIME'
  | 'BOOLEAN';

export declare type JoinOperator = 'OR' | 'AND';

export declare type GlobalFilterOperator = 'LIKE' | 'NLIKE' | 'EQ' | 'NEQ';

export declare type ColumnFilterOperator =
  | GlobalFilterOperator
  | 'GT'
  | 'GTE'
  | 'LT'
  | 'LTE'
  | 'IN';

export declare type GlobalFilter = {
  operator?: GlobalFilterOperator;
  keyword: string;
};

export declare type ColumnFilter<
  GridDataModel,
  K extends keyof GridDataModel = keyof GridDataModel
> = K extends keyof GridDataModel
  ? {
      column: K;
      operator?: ColumnFilterOperator;
      keyword: GridDataModel[K];
    }
  : never;

export declare type Filter<T> = {
  filters: Array<T>;
  filtersJoinOperator?: JoinOperator;
};

export declare type SortType<GridDataModel> = {
  [key in keyof GridDataModel]: 'asc' | 'desc';
};

export declare type Pagination = {
  startRow: number;
  rowCount: number;
};

export declare type Query<GridDataModel> = {
  globalFilter?: Filter<GlobalFilter>;
  columnFilter?: Filter<ColumnFilter<GridDataModel>>;
  globalColumnFilterJoinOperator?: JoinOperator;
  selectColumnNames?: Array<keyof GridDataModel>;
  sort?: SortType<GridDataModel>;
  pagination?: Pagination;
  sendRowIdsInResponse?: boolean;
  showColumnNamesInResponse?: boolean;
};

export declare type RowEntry<GridDataModel> = Partial<GridDataModel>;

export declare type Insert<GridDataModel> = {
  rows: Array<RowEntry<GridDataModel>>;
};

export declare type InsertObject<GridDataModel> = {
  insert: Insert<GridDataModel>;
};

export declare type QueryObject<GridDataModel> = {
  query: Query<GridDataModel>;
};

export declare type Distinct<GridDataModel> = {
  columnNames?: Array<keyof GridDataModel>;
};

export declare type QueryDistinctObject<GridDataModel> = {
  query: Query<GridDataModel>;
  distinct: Distinct<GridDataModel>;
};

export declare type QueryUpdate<GridDataModel> = {
  columns: RowEntry<GridDataModel>;
};

export declare type QueryUpdateObject<GridDataModel> = {
  query: Query<GridDataModel>;
  update: QueryUpdate<GridDataModel>;
};

export declare type UpdateRowId<GridDataModel> = {
  rowId: string;
  columns: RowEntry<GridDataModel>;
};

export declare type UpdateRowIds<GridDataModel> = {
  rows: Array<UpdateRowId<GridDataModel>>;
};

export declare type UpdateRowIdObject<GridDataModel> = {
  update: UpdateRowIds<GridDataModel>;
};

export declare type UpdateColumnDatatype<GridDataModel> = {
  columnName: keyof GridDataModel;
  dataType: DataType;
};

export declare type UpdateColumnDatatypeObject<GridDataModel> = {
  columns: Array<UpdateColumnDatatype<GridDataModel>>;
};

export declare type DeleteQueryObject<GridDataModel> = {
  delete: QueryObject<GridDataModel>;
};

export declare type RowId = {
  rowId: string;
};

export declare type DeleteRowIds = {
  rows: Array<RowId>;
};

export declare type DeleteRowIdObject = {
  delete: DeleteRowIds;
};

export declare type APIResponse =
  | (AxiosResponse & { error: void })
  | {
      data: void;
      error: Error;
    };

const getAPIURL = (qa?: boolean) =>
  qa == null
    ? `https://${qa ? 'qa' : 'www'}.bigparser.com/api/v2`
    : `https://${process.env.BP_QA ? 'qa' : 'www'}.bigparser.com/api/v2`;

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

function to(
  promise: Promise<AxiosResponse>
): Promise<APIResponse> {
  return promise
    .then((response: AxiosResponse) => ({
      ...response,
      error: undefined,
    }))
    .catch((err: Error) => (
      { error: err, data: undefined }
    ));
}

export async function search<GridDataModel>(
  queryObj: QueryObject<GridDataModel>,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.post(
      gridURL('search', gridId, viewId, qa),
      queryObj,
      authId != null ? { headers: { authId } } : config
    )
  );
}

export async function searchCount<GridDataModel>(
  queryObj: QueryObject<GridDataModel>,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.post(
      gridURL('search_count', gridId, viewId, qa),
      queryObj,
      authId != null ? { headers: { authId } } : config
    )
  );
}

export async function searchDistinct<GridDataModel>(
  queryDistinctObj: QueryDistinctObject<GridDataModel>,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.post(
      gridURL('distinct', gridId, viewId, qa),
      queryDistinctObj,
      authId != null ? { headers: { authId } } : config
    )
  );
}

export async function insert<GridDataModel>(
  insertObj: InsertObject<GridDataModel>,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.post(
      gridURL('rows/create', gridId, viewId, qa),
      insertObj,
      authId != null ? { headers: { authId } } : config
    )
  );
}

export async function updateByQuery<GridDataModel>(
  queryUpdateObj: QueryUpdateObject<GridDataModel>,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.put(
      gridURL('rows/update_by_queryObj', gridId, viewId, qa),
      queryUpdateObj,
      authId != null ? { headers: { authId } } : config
    )
  );
}

export async function updateByRowId<GridDataModel>(
  updateByRowIdObj: UpdateRowIdObject<GridDataModel>,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.put(
      gridURL('rows/update_by_rowIds', gridId, viewId, qa),
      updateByRowIdObj,
      authId != null ? { headers: { authId } } : config
    )
  );
}

export async function updateColumnDatatype<GridDataModel>(
  updateColumnDatatypeObj: UpdateColumnDatatypeObject<GridDataModel>,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.put(
      gridURL('update_column_datatype', gridId, viewId, qa),
      updateColumnDatatypeObj,
      authId != null ? { headers: { authId } } : config
    )
  );
}

export async function deleteByQuery<GridDataModel>(
  deleteQueryObj: DeleteQueryObject<GridDataModel>,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.delete(
      gridURL('rows/delete_by_queryObj', gridId, viewId, qa),
      authId != null
        ? { headers: { authId }, data: deleteQueryObj }
        : { ...config, data: deleteQueryObj }
    )
  );
}

export async function deleteByRowId(
  deleteRowIdObj: DeleteRowIdObject,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.delete(
      gridURL('rows/delete_by_rowIds', gridId, viewId, qa),
      authId != null
        ? { headers: { authId }, data: deleteRowIdObj }
        : { ...config, data: deleteRowIdObj }
    )
  );
}

export async function getHeaders(
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.get(
      gridURL('query_metadata', gridId, viewId, qa),
      authId != null ? { headers: { authId } } : config
    )
  );
}

export async function getMultisheetMetadata(
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.get(
      gridURL('query_multisheet_metadata', gridId, viewId, qa),
      authId != null ? { headers: { authId } } : config
    )
  );
}
