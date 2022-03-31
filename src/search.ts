import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, QueryObject } from './types';

export async function search<GridDataModel>(
  queryObj: QueryObject<GridDataModel>,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.post(
      gridURL('search', gridId, viewId, qa),
      queryObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
