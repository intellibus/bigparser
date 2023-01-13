import {
  APIResponse,
  AxiosResponseType,
  AxiosErrorType,
  MethodConfig,
} from './types';

export const getBaseURL = (qa?: boolean) =>
  `https://${
    (qa != null && qa) || process.env.BP_QA ? 'qa' : 'www'
  }.bigparser.com/api/v2`;

export function getGridURL(
  action: string,
  gridId: string,
  config: MethodConfig,
): string {
  const { shareId, qa } = config;
  return `${getBaseURL(qa)}/grid/${
    shareId ? `${gridId}/share/${shareId}` : `${gridId}`
  }/${action}`;
}

export function getGridURLShareIdQueryParam(
  action: string,
  gridId: string,
  config: MethodConfig,
): string {
  const { shareId, qa } = config;
  return `${getBaseURL(qa)}/grid/${gridId}/${action}${
    shareId ? `?shareId=${shareId}` : ''
  }`;
}

export function getAPIURL(action: string, config: MethodConfig): string {
  return `${getBaseURL(config.qa)}/grid/${action}`;
}

export function getV1APIURL(action: string, config: MethodConfig): string {
  return `${getBaseURL(config.qa).replace(
    'api/v2',
    'APIServices/api',
  )}/${action}`;
}

export const HEADERS = {
  headers: {
    authId: process.env.BP_AUTH,
  },
};

export function getHTTPHeaders(config: MethodConfig) {
  const { authId } = config;
  return authId != null ? { headers: { authId } } : HEADERS;
}

export function getHTTPHeadersWithData<T>(data: T, config: MethodConfig) {
  const { authId } = config;
  return authId != null ? { headers: { authId }, data } : { ...HEADERS, data };
}

export async function to(
  promise: Promise<AxiosResponseType>,
): Promise<APIResponse> {
  return promise
    .then((response: AxiosResponseType) => ({
      ...response,
      error: undefined,
    }))
    .catch((err: AxiosErrorType) => ({ error: err, data: undefined }));
}
