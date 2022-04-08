import axios from 'axios';
import { getHTTPHeadersWithData, getGridURL, to } from './utils';
import { APIResponse, DeleteQueryObject, MethodConfig } from './types';

export async function deleteByQuery<GridDataModel>(
  deleteQueryObj: DeleteQueryObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {},
): Promise<APIResponse> {
  return to(
    axios.delete(
      getGridURL('rows/delete_by_queryObj', gridId, config),
      getHTTPHeadersWithData<DeleteQueryObject<GridDataModel>>(
        deleteQueryObj,
        config,
      ),
    ),
  );
}
