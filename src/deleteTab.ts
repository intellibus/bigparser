import axios from 'axios';
import { gridURL, to, CONFIG } from './utils';
import { APIResponse, MethodConfig } from './types';

export async function deleteTab(
  gridId: string,
  config: MethodConfig = {}
): Promise<APIResponse> {
  // TODO: is viewId acceptable?
  const { viewId, qa, authId } = config;
  return to(
    axios.delete(
      gridURL('delete_tab', gridId, viewId, qa),
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
