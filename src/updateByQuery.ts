import axios from 'axios';
import { getGridURL, getHTTPHeaders, to } from './utils';
import { APIResponse, MethodConfig, QueryUpdateObject } from './types';

export async function updateByQuery<GridDataModel>(
  queryUpdateObj: QueryUpdateObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  return to(
    axios.put(
      getGridURL('rows/update_by_queryObj', gridId, config),
      queryUpdateObj,
      getHTTPHeaders(config)
    )
  );
}
