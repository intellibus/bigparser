import axios from 'axios';
import { getGridURL, getHTTPHeaders, to } from './utils';
import { APIResponse, MethodConfig, QueryObject } from './types';

export async function search<GridDataModel>(
  queryObj: QueryObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {},
): Promise<APIResponse> {
  return to(
    axios.post(
      getGridURL('search', gridId, config),
      queryObj,
      getHTTPHeaders(config),
    ),
  );
}
