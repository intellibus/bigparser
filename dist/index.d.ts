declare type BigParserRow = any;
declare type BigParserRows = Array<BigParserRow>;
declare interface BigParserData {
    rows: BigParserRows;
}
export declare interface APIResponse {
    data: {
        [name: string]: any;
    };
    status: number;
    statusText: string;
    headers: {
        [name: string]: any;
    };
}
declare type DataType = 'STRING' | 'NUMBER' | 'DATE' | 'DATE_TIME' | 'BOOLEAN';
declare type JoinOperator = 'OR' | 'AND';
declare type GlobalFilterOperator = 'LIKE' | 'NLIKE' | 'EQ' | 'NEQ';
declare type ColumnFilterOperator = GlobalFilterOperator | 'GT' | 'GTE' | 'LT' | 'LTE' | 'IN';
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
declare interface DeleteRowIdObject {
    delete: {
        rows: {
            rowId: string;
        }[];
    };
}
declare interface DeleteQueryObject {
    delete: QueryObject;
}
declare namespace BigParser {
    function search(queryObj: QueryObject, gridId: string, viewId?: string): Promise<APIResponse>;
    function searchCount(queryObj: QueryObject, gridId: string, viewId?: string): Promise<APIResponse>;
    function searchDistinct(queryDistinctObj: QueryDistinctObject, gridId: string, viewId?: string): Promise<APIResponse>;
    function insert(insertObj: InsertObject, gridId: string, viewId?: string): Promise<APIResponse>;
    function updateByQuery(queryUpdateObj: QueryUpdateObject, gridId: string, viewId?: string): Promise<APIResponse>;
    function update(updateObj: UpdateObject, gridId: string, viewId?: string): Promise<APIResponse>;
    function updateColumnDatatype(updateColumnDatatypeObj: UpdateColumnDatatypeObject, gridId: string, viewId?: string): Promise<APIResponse>;
    function deleteByRowId(deleteRowIdObj: DeleteRowIdObject, gridId: string, viewId?: string): Promise<APIResponse>;
    function deleteByQuery(deleteQueryObj: DeleteQueryObject, gridId: string, viewId?: string): Promise<APIResponse>;
    function getHeaders(gridId: string, viewId?: string): Promise<APIResponse>;
    function getMultisheetMetadata(gridId: string, viewId?: string): Promise<APIResponse>;
    function bulk_crud(obj: Object, gridId: string, viewId?: string): Promise<import("axios").AxiosResponse<any, any>>;
}
export default BigParser;
