import axios from 'axios';
import { gridlessURL, to, CONFIG } from './utils';
import { APIResponse, SetupLinkedColumnObject, MethodConfig } from './types';

export async function setupLinkedColumn<DestGridDataModel, SourceGridDataModel>(
  setupLinkedColumnObj: SetupLinkedColumnObject<DestGridDataModel, SourceGridDataModel>,
  config: MethodConfig = {}
): Promise<APIResponse> {
  const { qa, authId } = config;
  return to(
    axios.put(
      gridlessURL('setup_linked_column', qa),
      setupLinkedColumnObj,
      authId != null ? { headers: { authId } } : CONFIG
    )
  );
}
