import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, MethodConfig, QueryObject } from './types';

export async function search<GridDataModel>(
  queryObj: QueryObject<GridDataModel>,
  gridId: string,
  config?: MethodConfig
): Promise<APIResponse> {
  return to(
    axios.post(
      gridURL('search', gridId, config?.viewId, config?.qa),
      queryObj,
      config?.authId != null ? { headers: { authId: config?.authId } } : CONFIG
    )
  );
}
