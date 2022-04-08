import axios from 'axios';
import { getHTTPHeaders, getGridURL, to } from './utils';
import { APIResponse, MethodConfig } from './types';

export async function deleteTab(
  gridId: string,
  config: MethodConfig = {},
): Promise<APIResponse> {
  return to(
    axios.delete(
      getGridURL('delete_tab', gridId, config),
      getHTTPHeaders(config),
    ),
  );
}
