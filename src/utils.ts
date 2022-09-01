import fs from 'fs';
import * as TOML from '@ltd/j-toml';
import { homedir } from 'os';
import {
  APIResponse,
  AxiosResponseType,
  AxiosErrorType,
  MethodConfig,
  Credentials,
} from './types';

const getAuth = (qa: boolean) => {
  if (!process.env.BP_AUTH) {
    let credentials;
    try {
      credentials = TOML.parse(
        fs
          .readFileSync(`${homedir()}/.bigparser/credentials`)
          .toString('utf-8'),
      ) as Credentials;
      const profile = process.env.BP_PROFILE ?? 'default';
      if (credentials[profile]) {
        return credentials[profile][qa ? 'qa' : 'www'];
      }
    } catch (e) {
      // empty
    }
  }
  return process.env.BP_AUTH ?? undefined;
};

const getBaseURL = (qa: boolean | undefined) =>
  `https://${
    (qa != null && qa) ||
    (process.env.BP_QA != null && process.env.BP_QA === 'true')
      ? 'qa'
      : 'www'
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

export function getAPIURL(action: string, config: MethodConfig): string {
  return `${getBaseURL(config.qa)}/grid/${action}`;
}

export function getV1APIURL(action: string, config: MethodConfig): string {
  return `${getBaseURL(config.qa).replace(
    'api/v2',
    'APIServices/api',
  )}/${action}`;
}

export function getHTTPHeaders(config: MethodConfig) {
  return {
    headers: {
      authId:
        config.authId ??
        getAuth(
          (config.qa != null && config.qa) ||
            (process.env.BP_QA != null && process.env.BP_QA === 'true'),
        ),
    },
  };
}

export function getHTTPHeadersWithData<T>(data: T, config: MethodConfig) {
  return { ...getHTTPHeaders(config), data };
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
