import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, MethodConfig, UpdateColumnDatatypeObject } from './types';

export async function updateColumnDatatype<GridDataModel>(
  updateColumnDatatypeObj: UpdateColumnDatatypeObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { viewId, qa, authId } = config;
  return to(
    axios.put(
      gridURL('update_column_datatype', gridId, viewId, qa),
      updateColumnDatatypeObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
