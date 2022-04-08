import axios from 'axios';
import { getHTTPHeadersWithData, getGridURL, to } from './utils';
import { APIResponse, DeleteRowIdObject, MethodConfig } from './types';

export async function deleteByRowId(
  deleteRowIdObj: DeleteRowIdObject,
  gridId: string,
  config: MethodConfig = {},
): Promise<APIResponse> {
  return to(
    axios.delete(
      getGridURL('rows/delete_by_rowIds', gridId, config),
      getHTTPHeadersWithData<DeleteRowIdObject>(deleteRowIdObj, config),
    ),
  );
}
