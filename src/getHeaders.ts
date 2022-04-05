import axios from 'axios';
import { getGridURL, getHTTPHeaders, to } from './utils';
import { APIResponse, MethodConfig } from './types';

export async function getHeaders(
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  return to(
    axios.get(
      getGridURL('query_metadata', gridId, config),
      getHTTPHeaders(config)
    )
  );
}
