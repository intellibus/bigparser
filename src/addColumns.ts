import axios from 'axios';
import { getGridURL, getHTTPHeaders, to } from './utils';
import { APIResponse, AddColumnsObject, MethodConfig } from './types';

export async function addColumns<GridDataModel>(
  addColumnObj: AddColumnsObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {},
): Promise<APIResponse> {
  return to(
    axios.post(
      getGridURL('add_columns', gridId, config),
      addColumnObj,
      getHTTPHeaders(config),
    ),
  );
}
