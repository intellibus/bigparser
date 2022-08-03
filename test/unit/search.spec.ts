import mockAxios from 'jest-mock-axios';
import fs from 'fs';
import { search } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

jest.mock('fs');
const mockReadFileSync = fs.readFileSync as jest.MockedFunction<
  typeof fs.readFileSync
>;

const { env } = process;
const TEST_GRID_ID = 'VALID_GRID_ID';
const queryObject = {
  query: {
    sendRowIdsInResponse: true,
    showColumnNamesInResponse: true,
  },
};
const credentials = `
[default]
www = "VALID_AUTH_ID_CREDFILE"
qa = "VALID_AUTH_ID_CREDFILE_2"
[profile1]
www = "VALID_AUTH_ID_CREDFILE_3"
`;

describe('Search', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });
  afterEach(() => {
    mockAxios.reset();
    process.env = env;
  });
  afterAll(() => {
    jest.unmock('fs');
  });
  describe('Positive Test Cases', () => {
    it('Returns Grid Data from Production', async () => {
      // Given
      process.env.BP_AUTH = 'VALID_AUTH_ID';
      const response = {
        totalRowCount: 1,
        rows: [
          {
            _id: '6243cd4ec9d082361703ea4e',
            'String Column': 'Example String',
            'Number Column': 1337,
            'Number 2 Column': 1234.5678,
            'Boolean Column': true,
            'Date Column':
              'Tue Mar 29 2022 23:20:30 GMT-0400 (Eastern Daylight Time)',
            'Linked Column': '20171',
            'Linked Related Column From Other Grid': 'Related Column Value 4',
            'Formula Column': null,
            'Empty Column': '',
          },
        ],
      };

      // When
      const searchPromise = search<TestGrid>(queryObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search`,
        queryObject,
        {
          headers: {
            authId: 'VALID_AUTH_ID',
          },
        },
      );
      expect(error).toEqual(undefined);
      expect(data).toEqual(response);
    });
    it('Returns Grid Data from Production (Reading From .bigparser/credentials)', async () => {
      // Given
      process.env.BP_AUTH = null;
      process.env.BP_QA = null;
      const response = {
        totalRowCount: 1,
        rows: [
          {
            _id: '6243cd4ec9d082361703ea4e',
            'String Column': 'Example String',
            'Number Column': 1337,
            'Number 2 Column': 1234.5678,
            'Boolean Column': true,
            'Date Column':
              'Tue Mar 29 2022 23:20:30 GMT-0400 (Eastern Daylight Time)',
            'Linked Column': '20171',
            'Linked Related Column From Other Grid': 'Related Column Value 4',
            'Formula Column': null,
            'Empty Column': '',
          },
        ],
      };

      // When
      mockReadFileSync.mockReturnValueOnce(Buffer.from(credentials, 'utf-8'));
      const searchPromise = search<TestGrid>(queryObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search`,
        queryObject,
        {
          headers: {
            authId: 'VALID_AUTH_ID_CREDFILE',
          },
        },
      );
      expect(error).toEqual(undefined);
      expect(data).toEqual(response);
    });
    it('Returns Grid Data from Production (Reading From .bigparser/credentials using BP_PROFILE Environment Variable)', async () => {
      // Given
      process.env.BP_AUTH = null;
      process.env.BP_QA = null;
      process.env.BP_PROFILE = 'profile1';
      const response = {
        totalRowCount: 1,
        rows: [
          {
            _id: '6243cd4ec9d082361703ea4e',
            'String Column': 'Example String',
            'Number Column': 1337,
            'Number 2 Column': 1234.5678,
            'Boolean Column': true,
            'Date Column':
              'Tue Mar 29 2022 23:20:30 GMT-0400 (Eastern Daylight Time)',
            'Linked Column': '20171',
            'Linked Related Column From Other Grid': 'Related Column Value 4',
            'Formula Column': null,
            'Empty Column': '',
          },
        ],
      };

      // When
      mockReadFileSync.mockReturnValueOnce(Buffer.from(credentials, 'utf-8'));
      const searchPromise = search<TestGrid>(queryObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search`,
        queryObject,
        {
          headers: {
            authId: 'VALID_AUTH_ID_CREDFILE_3',
          },
        },
      );
      expect(error).toEqual(undefined);
      expect(data).toEqual(response);
    });
    it('Returns Grid Data from QA (Using BP_QA Environment Variable)', async () => {
      // Given
      process.env.BP_AUTH = 'VALID_AUTH_ID';
      process.env.BP_QA = 'true';
      const response = {
        totalRowCount: 1,
        rows: [
          {
            _id: '6243cd4ec9d082361703ea4e',
            'String Column': 'Example String',
            'Number Column': 1337,
            'Number 2 Column': 1234.5678,
            'Boolean Column': true,
            'Date Column':
              'Tue Mar 29 2022 23:20:30 GMT-0400 (Eastern Daylight Time)',
            'Linked Column': '20171',
            'Linked Related Column From Other Grid': 'Related Column Value 4',
            'Formula Column': null,
            'Empty Column': '',
          },
        ],
      };

      // When
      const searchPromise = search<TestGrid>(queryObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://qa.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search`,
        queryObject,
        {
          headers: {
            authId: 'VALID_AUTH_ID',
          },
        },
      );
      expect(error).toEqual(undefined);
      expect(data).toEqual(response);
    });
    it('Returns Grid Data from QA', async () => {
      // Given
      process.env.BP_AUTH = 'VALID_AUTH_ID';
      const response = {
        totalRowCount: 1,
        rows: [
          {
            _id: '6243cd4ec9d082361703ea4e',
            'String Column': 'Example String',
            'Number Column': 1337,
            'Number 2 Column': 1234.5678,
            'Boolean Column': true,
            'Date Column':
              'Tue Mar 29 2022 23:20:30 GMT-0400 (Eastern Daylight Time)',
            'Linked Column': '20171',
            'Linked Related Column From Other Grid': 'Related Column Value 4',
            'Formula Column': null,
            'Empty Column': '',
          },
        ],
      };

      // When
      const searchPromise = search<TestGrid>(queryObject, TEST_GRID_ID, {
        qa: true,
      });
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://qa.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search`,
        queryObject,
        {
          headers: {
            authId: 'VALID_AUTH_ID',
          },
        },
      );
      expect(error).toEqual(undefined);
      expect(data).toEqual(response);
    });
    it('Returns Grid Data from QA (Reading From .bigparser/credentials)', async () => {
      // Given
      process.env.BP_AUTH = null;
      process.env.BP_QA = null;
      const response = {
        totalRowCount: 1,
        rows: [
          {
            _id: '6243cd4ec9d082361703ea4e',
            'String Column': 'Example String',
            'Number Column': 1337,
            'Number 2 Column': 1234.5678,
            'Boolean Column': true,
            'Date Column':
              'Tue Mar 29 2022 23:20:30 GMT-0400 (Eastern Daylight Time)',
            'Linked Column': '20171',
            'Linked Related Column From Other Grid': 'Related Column Value 4',
            'Formula Column': null,
            'Empty Column': '',
          },
        ],
      };

      // When
      mockReadFileSync.mockReturnValueOnce(Buffer.from(credentials, 'utf-8'));
      const searchPromise = search<TestGrid>(queryObject, TEST_GRID_ID, {
        qa: true,
      });
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://qa.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search`,
        queryObject,
        {
          headers: {
            authId: 'VALID_AUTH_ID_CREDFILE_2',
          },
        },
      );
      expect(error).toEqual(undefined);
      expect(data).toEqual(response);
    });
  });
  describe('Negative Test Cases', () => {
    it('Rejects Invalid Grid Id', async () => {
      // Given
      process.env.BP_AUTH = 'VALID_AUTH_ID';
      const errorObject = {
        err: {
          message: 'Invalid Grid Id',
          statusCode: 404,
        },
      };

      // When
      const searchPromise = search<TestGrid>(queryObject, 'INVALID_GRID_ID');
      mockAxios.mockError(errorObject);
      const { data, error } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://www.bigparser.com/api/v2/grid/INVALID_GRID_ID/search',
        queryObject,
        {
          headers: {
            authId: 'VALID_AUTH_ID',
          },
        },
      );
      expect(data).toEqual(undefined);
      expect(error).toEqual(errorObject);
    });
    it('Rejects Invalid Share Id', async () => {
      // Given
      process.env.BP_AUTH = 'VALID_AUTH_ID';
      const errorObject = {
        err: {
          message: 'Invalid Share Id',
          statusCode: 404,
        },
      };

      // When
      const searchPromise = search<TestGrid>(queryObject, TEST_GRID_ID, {
        shareId: 'INVALID_SHARE_ID',
      });
      mockAxios.mockError(errorObject);
      const { data, error } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/share/INVALID_SHARE_ID/search`,
        queryObject,
        {
          headers: {
            authId: 'VALID_AUTH_ID',
          },
        },
      );
      expect(data).toEqual(undefined);
      expect(error).toEqual(errorObject);
    });
    it('Rejects Invalid Auth Id', async () => {
      // Given
      const errorObject = {
        err: {
          message: 'Invalid Auth Id',
          statusCode: 403,
        },
      };

      // When
      const searchPromise = search<TestGrid>(queryObject, TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
      });
      mockAxios.mockError(errorObject);
      const { data, error } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search`,
        queryObject,
        {
          headers: {
            authId: 'INVALID_AUTHID',
          },
        },
      );
      expect(data).toEqual(undefined);
      expect(error).toEqual(errorObject);
    });
    it('Rejects Invalid Auth Id (No Auth Id Provided)', async () => {
      // Given
      process.env.BP_AUTH = null;
      const errorObject = {
        err: {
          message: 'Invalid Auth Id',
          statusCode: 403,
        },
      };

      // When
      mockReadFileSync.mockReturnValueOnce(Buffer.from('', 'base64'));
      const searchPromise = search<TestGrid>(queryObject, TEST_GRID_ID);
      mockAxios.mockError(errorObject);
      const { data, error } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search`,
        queryObject,
        {
          headers: {
            authId: undefined,
          },
        },
      );
      expect(data).toEqual(undefined);
      expect(error).toEqual(errorObject);
    });
  });
});
