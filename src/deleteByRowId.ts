import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, DeleteRowIdObject } from './types';

export async function deleteByRowId(
  deleteRowIdObj: DeleteRowIdObject,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.delete(
      gridURL('rows/delete_by_rowIds', gridId, viewId, qa),
      authId != null
        ? { headers: { authId }, data: deleteRowIdObj }
        : { ...CONFIG, data: deleteRowIdObj }
    )
  );
}
