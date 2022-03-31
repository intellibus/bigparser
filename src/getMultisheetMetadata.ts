import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse } from './types';

export async function getMultisheetMetadata(
  gridId: string,
  viewId?: string,
  authId?: string,
  qa?: boolean
): Promise<APIResponse> {
  return to(
    axios.get(
      gridURL('query_multisheet_metadata', gridId, viewId, qa),
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
