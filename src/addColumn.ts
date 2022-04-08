import axios from 'axios';
import { getGridURL, getHTTPHeaders, to } from './utils';
import { APIResponse, AddColumnObject, MethodConfig } from './types';

export async function addColumn<GridDataModel>(
  addColumnObj: AddColumnObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {},
): Promise<APIResponse> {
  return to(
    axios.post(
      getGridURL('add_column', gridId, config),
      addColumnObj,
      getHTTPHeaders(config),
    ),
  );
}
