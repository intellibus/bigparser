import axios from 'axios';
import { getGridURL, getHTTPHeaders, to } from './utils';
import { APIResponse, MethodConfig, QueryObject } from './types';

export async function searchCount<GridDataModel>(
  queryObj: QueryObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  return to(
    axios.post(
      getGridURL('search_count', gridId, config),
      queryObj,
      getHTTPHeaders(config)
    )
  );
}
