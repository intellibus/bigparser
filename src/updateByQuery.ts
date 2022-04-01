import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, MethodConfig, QueryUpdateObject } from './types';

export async function updateByQuery<GridDataModel>(
  queryUpdateObj: QueryUpdateObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { viewId, qa, authId } = config;
  return to(
    axios.put(
      gridURL('rows/update_by_queryObj', gridId, viewId, qa),
      queryUpdateObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
