import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, MethodConfig, QueryObject } from './types';

export async function search<GridDataModel>(
  queryObj: QueryObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { viewId, qa, authId } = config;
  return to(
    axios.post(
      gridURL('search', gridId, viewId, qa),
      queryObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
