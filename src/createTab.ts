import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, CreateTabObject, MethodConfig } from './types';

export async function createTab(
  createTabObj: CreateTabObject,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { viewId, qa, authId } = config;
  return to(
    axios.post(
      // TODO: Confirm how viewId is used
      gridURL('create_tab', gridId, viewId, qa),
      createTabObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
