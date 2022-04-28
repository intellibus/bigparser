import { AxiosResponse, AxiosError } from 'axios';

// BigParser Types
export declare type DataType =
  | 'STRING'
  | 'NUMBER'
  | 'DATE'
  | 'DATE_TIME'
  | 'BOOLEAN';

export declare type JoinOperator = 'OR' | 'AND';

export declare type GlobalFilterOperator = 'LIKE' | 'NLIKE' | 'EQ' | 'NEQ';

export declare type FunctionType = 'SUM' | 'AVG' | 'MIN' | 'MAX';

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
  K extends keyof GridDataModel = keyof GridDataModel,
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

export declare type Insert<GridDataModel> = {
  rows: Array<Partial<GridDataModel>>;
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
  columns: Partial<GridDataModel>;
};

export declare type QueryUpdateObject<GridDataModel> = {
  query: Query<GridDataModel>;
  update: QueryUpdate<GridDataModel>;
};

export declare type UpdateRowId<GridDataModel> = {
  rowId: string;
  columns: Partial<GridDataModel>;
};

export declare type UpdateRowIds<GridDataModel> = {
  rows: Array<UpdateRowId<GridDataModel>>;
};

export declare type UpdateRowIdObject<GridDataModel> = {
  update: UpdateRowIds<GridDataModel>;
};

export declare type InsertColumn = { columnName: string; dataType?: DataType };

export declare type UpdateColumnDatatype<GridDataModel> = {
  columnName: keyof GridDataModel;
  dataType: DataType;
};

export declare type UpdateColumnDatatypeObject<GridDataModel> = {
  columns: Array<UpdateColumnDatatype<GridDataModel>>;
};

export declare type UpdateColumnDataSource<GridDataModel> = {
  columnDataSource: {
    columnNames: Array<keyof GridDataModel>;
    functionType: FunctionType;
  };
  columnName: keyof GridDataModel;
};

export declare type UpdateColumnDataSourceObject<GridDataModel> = {
  columns: Array<UpdateColumnDataSource<GridDataModel>>;
};

export declare type DeleteQueryObject<GridDataModel> = {
  delete: QueryObject<GridDataModel>;
};

export declare type DeleteRowIds = {
  rows: Array<{ rowId: string }>;
};

export declare type DeleteRowIdObject = {
  delete: DeleteRowIds;
};

export declare type GridTab = {
  tabName: string;
  tabDescription?: string;
};

export declare type CreateGridObject = {
  gridName: string;
  gridDescription?: string;
  gridTabs?: Array<GridTab>;
};

export declare type CreateTabObject = GridTab;

export declare type UpdateTabObject = GridTab;

export declare type LinkedRelatedColumn<
  DestinationGridDataModel,
  SourceGridDataModel,
> = {
  destColName: keyof DestinationGridDataModel;
  srcColName: keyof SourceGridDataModel;
};

export declare type SetupLinkedColumnObject<
  DestinationGridDataModel,
  SourceGridDataModel,
> = {
  destinationColumnName: keyof DestinationGridDataModel;
  destinationGridId: string;
  linkedRelatedColumns: Array<
    LinkedRelatedColumn<DestinationGridDataModel, SourceGridDataModel>
  >;
  queryInSourceGrid?: Query<DestinationGridDataModel>;
  sourceColumnName: keyof SourceGridDataModel;
  sourceGridId: string;
};

export declare type ColumnPosition<GridDataModel> = {
  columnName: keyof GridDataModel;
  columnIndex?: string;
};

export declare type AfterColumnObject<AfterType> = {
  afterColumn?: AfterType;
  beforeColumn?: never;
};

export declare type BeforeColumnObject<BeforeType> = {
  afterColumn?: never;
  beforeColumn?: BeforeType;
};

export declare type AfterRowIdObject = {
  afterRowId?: string;
  beforeRowId?: never;
};

export declare type BeforeRowIdObject = {
  afterRowId?: never;
  beforeRowId?: string;
};

export declare type AddColumnObject<GridDataModel> = (
  | AfterColumnObject<ColumnPosition<GridDataModel>>
  | BeforeColumnObject<ColumnPosition<GridDataModel>>
) & {
  newColumnName: string;
};

export declare type BulkDeleteColumns<GridDataModel> = {
  columns: Array<ColumnPosition<GridDataModel>>;
};

export declare type BulkInsertColumns<GridDataModel> = (
  | AfterColumnObject<keyof GridDataModel>
  | BeforeColumnObject<keyof GridDataModel>
) & { columns: Array<InsertColumn> };

export declare type BulkRenameColumn<GridDataModel> = {
  existingColumnName: keyof GridDataModel;
  newColumnName: string;
};

export declare type BulkRenameColumns<GridDataModel> = {
  columns: Array<BulkRenameColumn<GridDataModel>>;
};

export declare type BulkInsertRow = {
  [column: string]: string | number | boolean;
};

export declare type BulkInsert = {
  rows: Array<BulkInsertRow>;
};

export declare type BulkInsertRows = (AfterRowIdObject | BeforeRowIdObject) &
  BulkInsert;

export declare type BulkCrudObject<GridDataModel> = {
  insertColumns?: Array<BulkInsertColumns<GridDataModel>>;
  deleteColumns?: BulkDeleteColumns<GridDataModel>;
  renameColumns?: BulkRenameColumns<GridDataModel>;
  insertRows?: Array<BulkInsertRows>;
  updateRows?: UpdateRowIds<GridDataModel>;
  deleteRows?: DeleteRowIds;
};

export declare type APIResponse =
  | (AxiosResponse & { error: void })
  | {
      data: void;
      error: AxiosError;
    };

export declare type MethodConfig = {
  shareId?: string;
  authId?: string;
  qa?: boolean;
};

export type AxiosResponseType = AxiosResponse;

export type AxiosErrorType = AxiosError;
