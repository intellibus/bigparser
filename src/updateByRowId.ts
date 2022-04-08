import axios from 'axios';
import { getGridURL, getHTTPHeaders, to } from './utils';
import { APIResponse, MethodConfig, UpdateRowIdObject } from './types';

export async function updateByRowId<GridDataModel>(
  updateByRowIdObj: UpdateRowIdObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {},
): Promise<APIResponse> {
  return to(
    axios.put(
      getGridURL('rows/update_by_rowIds', gridId, config),
      updateByRowIdObj,
      getHTTPHeaders(config),
    ),
  );
}
