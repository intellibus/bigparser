import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, UpdateRowIdObject } from './types';

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
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
