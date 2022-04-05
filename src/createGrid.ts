import axios from 'axios';
import { gridlessURL, to, CONFIG } from './utils';
import { APIResponse, CreateGridObject, MethodConfig } from './types';

export async function createGrid(
  createGridObj: CreateGridObject,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { qa, authId } = config;
  return to(
    axios.post(
      gridlessURL('create_grid', qa),
      createGridObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
