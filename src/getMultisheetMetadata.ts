import axios from 'axios';
import { getGridURL, getHTTPHeaders, to } from './utils';
import { APIResponse, MethodConfig } from './types';

export async function getMultisheetMetadata(
  gridId: string,
  config: MethodConfig = {},
): Promise<APIResponse> {
  return to(
    axios.get(
      getGridURL('query_multisheet_metadata', gridId, config),
      getHTTPHeaders(config),
    ),
  );
}
