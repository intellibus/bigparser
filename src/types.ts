import { AxiosResponse } from 'axios';

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

export declare type UpdateColumnDataSource<GridDataModel> = {
  columnDataSource: {
    columnNames: Array<keyof GridDataModel>,
    functionType: FunctionType;
  },
  columnName: keyof GridDataModel;
}

export declare type UpdateColumnDataSourceObject<GridDataModel> = {
  columns: Array<UpdateColumnDataSource<GridDataModel>>;
}

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

export declare type GridTab = {
  tabName: string;
  tabDescription?: string;
}

export declare type CreateGridObject = {
  gridName: string;
  gridDescription?: string;
  gridTabs?: Array<GridTab>;
}

export declare type CreateTabObject = GridTab;

export declare type UpdateTabObject = GridTab;

// TODO: get exact docs
export declare type LinkedRelatedColumn<DestGridDataModel, SourceGridDataModel> = {
  destColName: keyof DestGridDataModel;
  srcColName: keyof SourceGridDataModel;
}

// TODO: get exact docs
export declare type SetupLinkedColumnObject<DestGridDataModel, SourceGridDataModel> = {
  destinationColumnName: keyof DestGridDataModel;
  destinationGridId: string;
  linkedRelatedColumns: Array<LinkedRelatedColumn<DestGridDataModel, SourceGridDataModel>>;
  queryInSourceGrid?: Query<SourceGridDataModel>;
  sourceColumnName: keyof SourceGridDataModel;
  sourceGridId: string;
}

export declare type APIResponse =
  | (AxiosResponse & { error: void })
  | {
      data: void;
      error: Error;
    };

export declare type MethodConfig = {
  viewId?: string;
  authId?: string;
  qa?: boolean;
};

export { AxiosResponse };
