import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, MethodConfig, UpdateRowIdObject } from './types';

export async function updateByRowId<GridDataModel>(
  updateByRowIdObj: UpdateRowIdObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { viewId, qa, authId } = config;
  return to(
    axios.put(
      gridURL('rows/update_by_rowIds', gridId, viewId, qa),
      updateByRowIdObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
