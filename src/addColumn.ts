import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, AddColumnObject, MethodConfig } from './types';

export async function addColumn<GridDataModel>(
  addColumnObj: AddColumnObject<GridDataModel>,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { viewId, qa, authId } = config;
  return to(
    axios.post(
      // TODO: Confirm how viewId is used
      gridURL('add_column', gridId, viewId, qa),
      addColumnObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
