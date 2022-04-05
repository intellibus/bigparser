import axios from 'axios';
import { getGridURL, getHTTPHeaders, to } from './utils';
import { APIResponse, InsertObject, MethodConfig } from './types';

export async function insert<GridDataModel>(
  insertObj: InsertObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  return to(
    axios.post(
      getGridURL('rows/create', gridId, config),
      insertObj,
      getHTTPHeaders(config)
    )
  );
}
