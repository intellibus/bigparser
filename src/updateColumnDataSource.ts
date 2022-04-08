import axios from 'axios';
import { getGridURL, getHTTPHeaders, to } from './utils';
import {
  APIResponse,
  MethodConfig,
  UpdateColumnDataSourceObject,
} from './types';

export async function updateColumnDataSource<GridDataModel>(
  updateColumnDataSourceObj: UpdateColumnDataSourceObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {},
): Promise<APIResponse> {
  return to(
    axios.put(
      getGridURL('update_column_dataSource', gridId, config),
      updateColumnDataSourceObj,
      getHTTPHeaders(config),
    ),
  );
}
