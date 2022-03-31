import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, InsertObject } from './types';

export async function insert<GridDataModel>(
  insertObj: InsertObject<GridDataModel>,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.post(
      gridURL('rows/create', gridId, viewId, qa),
      insertObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
