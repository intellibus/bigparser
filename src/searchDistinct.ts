import axios from 'axios';
import { getGridURL, getHTTPHeaders, to } from './utils';
import { APIResponse, MethodConfig, QueryDistinctObject } from './types';

export async function searchDistinct<GridDataModel>(
  queryDistinctObj: QueryDistinctObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  return to(
    axios.post(
      getGridURL('distinct', gridId, config),
      queryDistinctObj,
      getHTTPHeaders(config)
    )
  );
}
