// API Constants
import axios from 'axios'

// BigParser Types
declare type BigParserRow = any

declare type BigParserRows = Array<BigParserRow>

declare interface BigParserData {
  rows: BigParserRows
}

export declare interface APIResponse {
  data: {
    [name: string]: any,
  },
  status: number,
  statusText: string,
  headers: {
    [name: string]: any,
  },
}

declare type DataType = 'STRING' | 'NUMBER' | 'DATE' | 'DATE_TIME' | 'BOOLEAN'

declare type JoinOperator = 'OR' | 'AND'

declare type GlobalFilterOperator = 'LIKE' | 'NLIKE' | 'EQ' | 'NEQ'

declare type ColumnFilterOperator = GlobalFilterOperator | 'GT' | 'GTE' | 'LT' | 'LTE' | 'IN'

declare interface GlobalFilter {
  operator?: GlobalFilterOperator,
  keyword: string
}

declare interface ColumnFilter {
  column: string,
  operator?: ColumnFilterOperator,
  keyword: string
}

declare interface Filter<T> {
  filters: Array<T>,
  filtersJoinOperator?: JoinOperator
}

declare interface InsertObject {
  insert: BigParserData
}

declare interface QueryObject {
  query: {
    globalFilter?: Filter<GlobalFilter>,
    columnFilter?: Filter<ColumnFilter>,
    globalColumnFilterJoinOperator?: JoinOperator,
    selectColumnNames?: Array<string>,
    sort?: {
      [name: string]: string,
    },
    pagination?: {
      startRow: number,
      rowCount: number
    },
    sendRowIdsInResponse?: boolean,
    showColumnNamesInResponse?: boolean,
  }
}

declare interface QueryUpdateObject extends QueryObject {
  update: {
    columns: BigParserRow
  }
}

declare interface QueryDistinctObject extends QueryObject {
  distinct: {
    columnNames?: Array<string>
  }
}

declare interface UpdateObject {
  update: {
    rows: {
      rowId: string
      columns: BigParserRow
    }[]
  }
}

declare interface UpdateColumnDatatypeObject {
  columns: {
      columnName: string,
      dataType: DataType
  }[]
}

declare interface DeleteRowIdObject {
  delete: {
    rows: {
      rowId: string
    }[]
  }
}

declare interface DeleteQueryObject {
  delete: QueryObject
}

const APIURL = `https://${process.env.BP_QA ? 'qa' : 'www'}.bigparser.com/api/v2`

const API = axios.create({
  baseURL: APIURL,
  headers: {
    authId: `${process.env.BP_AUTH}`
  }
})

function gridURL (action: string, gridId: string, viewId?: string): string {
  return (viewId) ? `/grid/${gridId}/share/${viewId}/${action}` : `/grid/${gridId}/${action}`
}

namespace BigParser {
  export async function search (queryObj: QueryObject, gridId: string, viewId?: string): Promise<APIResponse> {
    return await API({
      method: 'post',
      url: gridURL('search', gridId, viewId),
      data: queryObj
    })
  }
  export async function searchCount (queryObj: QueryObject, gridId: string, viewId?: string): Promise<APIResponse> {
    return await API({
      method: 'post',
      url: gridURL('search_count', gridId, viewId),
      data: queryObj
    })
  }
  export async function searchDistinct (queryDistinctObj: QueryDistinctObject, gridId: string, viewId?: string): Promise<APIResponse> {
    return await API({
      method: 'post',
      url: gridURL('distinct', gridId, viewId),
      data: queryDistinctObj
    })
  }
  export async function insert (insertObj: InsertObject, gridId: string, viewId?: string): Promise<APIResponse> {
    return await API({
      method: 'post',
      url: gridURL('rows/create', gridId, viewId),
      data: insertObj
    })
  }
  export async function updateByQuery (queryUpdateObj: QueryUpdateObject, gridId: string, viewId?: string): Promise<APIResponse> {
    return await API({
      method: 'put',
      url: gridURL('rows/update_by_queryObj', gridId, viewId),
      data: queryUpdateObj
    })
  }
  export async function update (updateObj: UpdateObject, gridId: string, viewId?: string): Promise<APIResponse> {
    return await API({
      method: 'put',
      url: gridURL('rows/update_by_rowIds', gridId, viewId),
      data: updateObj
    })
  }
  export async function updateColumnDatatype (updateColumnDatatypeObj: UpdateColumnDatatypeObject, gridId: string, viewId?: string): Promise<APIResponse> {
    return await API({
      method: 'put',
      url: gridURL('update_column_datatype', gridId, viewId),
      data: updateColumnDatatypeObj
    })
  }
  export async function deleteByRowId (deleteRowIdObj: DeleteRowIdObject, gridId: string, viewId?: string): Promise<APIResponse> {
    return await API({
      method: 'delete',
      url: gridURL('rows/delete_by_rowIds', gridId, viewId),
      data: deleteRowIdObj
    })
  }
  export async function deleteByQuery (deleteQueryObj: DeleteQueryObject, gridId: string, viewId?: string): Promise<APIResponse> {
    return await API({
      method: 'delete',
      url: gridURL('rows/delete_by_queryObj', gridId, viewId),
      data: deleteQueryObj
    })
  }
  export async function getHeaders (gridId: string, viewId?: string): Promise<APIResponse> {
    return await API({
      method: 'get',
      url: gridURL('query_metadata', gridId, viewId)
    })
  }
  export async function getMultisheetMetadata (gridId: string, viewId?: string): Promise<APIResponse> {
    return await API({
      method: 'get',
      url: gridURL('query_multisheet_metadata', gridId, viewId)
    })
  }
  export async function bulk_crud (obj: Object, gridId: string, viewId?: string) {
    return await API({
      method: 'post',
      url: gridURL('rows_columns/bulk_crud', gridId, viewId),
      data: obj
    })
  }
}

export default BigParser
