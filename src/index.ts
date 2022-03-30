// API Constants
import axios, { AxiosResponse } from 'axios';

// BigParser Types
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
  [key in keyof GridDataModel]: string;
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

export declare type QueryObject<GridDataModel> = {
  query: Query<GridDataModel>;
};

export declare type APIResponse =
  | (AxiosResponse & { error: string })
  | {
      data: void;
      error: string;
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

export async function search<GridDataModel>(
  queryObj: QueryObject<GridDataModel>,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  let restResponse: AxiosResponse;
  try {
    restResponse = await axios.post(
      gridURL('search', gridId, viewId, qa),
      queryObj,
      authId != null ? { headers: { authId } } : config
    );
    return { ...restResponse, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function searchCount<GridDataModel>(
  queryObj: QueryObject<GridDataModel>,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  let restResponse: AxiosResponse;
  try {
    restResponse = await axios.post(
      gridURL('search_count', gridId, viewId, qa),
      queryObj,
      authId != null ? { headers: { authId } } : config
    );
    return { ...restResponse, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function searchDistinct<GridDataModel>(
  queryObj: QueryObject<GridDataModel>, // TODO: Update Type + Var Name
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  let restResponse: AxiosResponse;
  try {
    restResponse = await axios.post(
      gridURL('distinct', gridId, viewId, qa),
      queryObj,
      authId != null ? { headers: { authId } } : config
    );
    return { ...restResponse, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function insert<GridDataModel>(
  queryObj: QueryObject<GridDataModel>, // TODO: Update Type + Var Name
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  let restResponse: AxiosResponse;
  try {
    restResponse = await axios.post(
      gridURL('rows/create', gridId, viewId, qa),
      queryObj,
      authId != null ? { headers: { authId } } : config
    );
    return { ...restResponse, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateByQuery<GridDataModel>(
  queryObj: QueryObject<GridDataModel>, // TODO: Update Type + Var Name
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  let restResponse: AxiosResponse;
  try {
    restResponse = await axios.put(
      gridURL('rows/update_by_queryObj', gridId, viewId, qa),
      queryObj,
      authId != null ? { headers: { authId } } : config
    );
    return { ...restResponse, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function update<GridDataModel>(
  queryObj: QueryObject<GridDataModel>, // TODO: Update Type + Var Name
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  let restResponse: AxiosResponse;
  try {
    restResponse = await axios.put(
      gridURL('rows/update_by_rowIds', gridId, viewId, qa),
      queryObj,
      authId != null ? { headers: { authId } } : config
    );
    return { ...restResponse, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateColumnDatatype<GridDataModel>(
  queryObj: QueryObject<GridDataModel>, // TODO: Update Type + Var Name
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  let restResponse: AxiosResponse;
  try {
    restResponse = await axios.put(
      gridURL('update_column_datatype', gridId, viewId, qa),
      queryObj,
      authId != null ? { headers: { authId } } : config
    );
    return { ...restResponse, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getHeaders(
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  let restResponse: AxiosResponse;
  try {
    restResponse = await axios.get(
      gridURL('query_metadata', gridId, viewId, qa),
      authId != null ? { headers: { authId } } : config
    );
    return { ...restResponse, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getMultisheetMetadata(
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  let restResponse: AxiosResponse;
  try {
    restResponse = await axios.get(
      gridURL('query_multisheet_metadata', gridId, viewId, qa),
      authId != null ? { headers: { authId } } : config
    );
    return { ...restResponse, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
