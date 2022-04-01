import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, MethodConfig, QueryDistinctObject } from './types';

export async function searchDistinct<GridDataModel>(
  queryDistinctObj: QueryDistinctObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { viewId, qa, authId } = config;
  return to(
    axios.post(
      gridURL('distinct', gridId, viewId, qa),
      queryDistinctObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
