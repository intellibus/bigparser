import axios from 'axios';
import { getAPIURL, getHTTPHeaders, to } from './utils';
import { APIResponse, SetupLinkedColumnObject, MethodConfig } from './types';

export async function setupLinkedColumn<
  DestinationGridDataModel,
  SourceGridDataModel,
>(
  setupLinkedColumnObj: SetupLinkedColumnObject<
    DestinationGridDataModel,
    SourceGridDataModel
  >,
  config: MethodConfig = {},
): Promise<APIResponse> {
  return to(
    axios.put(
      getAPIURL('setup_linked_column', config),
      setupLinkedColumnObj,
      getHTTPHeaders(config),
    ),
  );
}
