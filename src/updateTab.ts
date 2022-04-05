import axios from 'axios';
import { getGridURL, getHTTPHeaders, to } from './utils';
import { APIResponse, CreateTabObject, MethodConfig } from './types';

export async function updateTab(
  updateTabObj: CreateTabObject,
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  return to(
    axios.post(
      getGridURL('update_tab', gridId, config),
      updateTabObj,
      getHTTPHeaders(config)
    )
  );
}
