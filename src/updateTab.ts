import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, CreateTabObject, MethodConfig } from './types';

export async function updateTab(
  updateTabObj: CreateTabObject,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { viewId, qa, authId } = config;
  return to(
    axios.post(
      // TODO: Confirm how viewId is used
      gridURL('update_tab', gridId, viewId, qa),
      updateTabObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
