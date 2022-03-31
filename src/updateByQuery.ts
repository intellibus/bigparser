import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, QueryUpdateObject } from './types';

export async function updateByQuery<GridDataModel>(
  queryUpdateObj: QueryUpdateObject<GridDataModel>,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.put(
      gridURL('rows/update_by_queryObj', gridId, viewId, qa),
      queryUpdateObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
