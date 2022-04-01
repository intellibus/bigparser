import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, MethodConfig, QueryObject } from './types';

export async function searchCount<GridDataModel>(
  queryObj: QueryObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { viewId, qa, authId } = config;
  return to(
    axios.post(
      gridURL('search_count', gridId, viewId, qa),
      queryObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
