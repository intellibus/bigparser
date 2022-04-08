import axios from 'axios';
import { getHTTPHeaders, getGridURL, to } from './utils';
import { APIResponse, CreateTabObject, MethodConfig } from './types';

export async function createTab(
  createTabObj: CreateTabObject,
  gridId: string,
  config: MethodConfig = {},
): Promise<APIResponse> {
  return to(
    axios.post(
      getGridURL('create_tab', gridId, config),
      createTabObj,
      getHTTPHeaders(config),
    ),
  );
}
