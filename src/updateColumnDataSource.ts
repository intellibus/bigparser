import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, MethodConfig, UpdateColumnDataSourceObject } from './types';

export async function updateColumnDataSource<GridDataModel>(
  updateColumnDataSourceObj: UpdateColumnDataSourceObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { viewId, qa, authId } = config;
  return to(
    axios.put(
      // TODO: Confirm how viewId is used
      gridURL('update_column_dataSource', gridId, viewId, qa),
      updateColumnDataSourceObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
