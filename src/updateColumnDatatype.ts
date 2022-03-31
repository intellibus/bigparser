import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, UpdateColumnDatatypeObject } from './types';

export async function updateColumnDatatype<GridDataModel>(
  updateColumnDatatypeObj: UpdateColumnDatatypeObject<GridDataModel>,
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.put(
      gridURL('update_column_datatype', gridId, viewId, qa),
      updateColumnDatatypeObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
