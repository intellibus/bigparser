import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, QueryDistinctObject } from './types';

export async function searchDistinct<GridDataModel>(
  queryDistinctObj: QueryDistinctObject<GridDataModel>,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.post(
      gridURL('distinct', gridId, viewId, qa),
      queryDistinctObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
