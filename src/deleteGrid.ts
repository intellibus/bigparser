import axios from 'axios';
import { getHTTPHeadersWithData, getV1APIURL, to } from './utils';
import { APIResponse, MethodConfig } from './types';

export async function deleteGrid(
  fileId: string,
  config: MethodConfig = {},
): Promise<APIResponse> {
  return to(
    axios.delete(
      getV1APIURL('file/remove', config),
      getHTTPHeadersWithData({ id: fileId }, config),
    ),
  );
}
