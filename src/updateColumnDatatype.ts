import axios from 'axios';
import { getGridURL, getHTTPHeaders, to } from './utils';
import { APIResponse, MethodConfig, UpdateColumnDatatypeObject } from './types';

export async function updateColumnDatatype<GridDataModel>(
  updateColumnDatatypeObj: UpdateColumnDatatypeObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {},
): Promise<APIResponse> {
  return to(
    axios.put(
      getGridURL('update_column_datatype', gridId, config),
      updateColumnDatatypeObj,
      getHTTPHeaders(config),
    ),
  );
}
