import { APIResponse, AxiosResponse } from './types';

export const getAPIURL = (qa?: boolean) =>
  `https://${
    (qa != null && qa) || process.env.BP_QA ? 'qa' : 'www'
  }.bigparser.com/api/v2`;

export const CONFIG = {
  headers: {
    authId: `${process.env.BP_AUTH}`,
  },
};

export function gridURL(
  action: string,
  gridId: string,
  viewId?: string,
  qa?: boolean
): string {
  return `${getAPIURL(qa)}/grid/${
    viewId ? `${gridId}/share/${viewId}` : `${gridId}`
  }/${action}`;
}

export async function to(
  promise: Promise<AxiosResponse>
): Promise<APIResponse> {
  return promise
    .then((response: AxiosResponse) => ({
      ...response,
      error: undefined,
    }))
    .catch((err: Error) => ({ error: err, data: undefined }));
}
