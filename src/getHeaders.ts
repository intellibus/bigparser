import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, MethodConfig } from './types';

export async function getHeaders(
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { viewId, qa, authId } = config;
  return to(
    axios.get(
      gridURL('query_metadata', gridId, viewId, qa),
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
