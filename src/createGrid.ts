import axios from 'axios';
import { getAPIURL, getHTTPHeaders, to } from './utils';
import { APIResponse, CreateGridObject, MethodConfig } from './types';

export async function createGrid(
  createGridObj: CreateGridObject,
  config: MethodConfig = {}
): Promise<APIResponse> {
  return to(
    axios.post(
      getAPIURL('create_grid', config),
      createGridObj,
      getHTTPHeaders(config)
    )
  );
}
