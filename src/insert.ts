import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, InsertObject, MethodConfig } from './types';

export async function insert<GridDataModel>(
  insertObj: InsertObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { viewId, qa, authId } = config;
  return to(
    axios.post(
      gridURL('rows/create', gridId, viewId, qa),
      insertObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
