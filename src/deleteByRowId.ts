import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, DeleteRowIdObject, MethodConfig } from './types';

export async function deleteByRowId(
  deleteRowIdObj: DeleteRowIdObject,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { viewId, qa, authId } = config;
  return to(
    axios.delete(
      gridURL('rows/delete_by_rowIds', gridId, viewId, qa),
      authId != null
        ? { headers: { authId }, data: deleteRowIdObj }
        : { ...CONFIG, data: deleteRowIdObj }
    )
  );
}
