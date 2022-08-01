import { AxiosError } from 'axios';
import { search } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';
import { QueryObject } from '../../src/types';
import {
  bootstrapIntegrationTests,
  cleanupIntegrationTests,
} from './integration.utils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

const {env} = process;
let TEST_GRID_ID: string;
let FIRST_ROW_ID: string;

const queryObject: QueryObject<TestGrid> = {
  query: {
    columnFilter: {
      filters: [
        {
          column: 'Boolean Column',
          operator: 'EQ',
          keyword: true,
        },
      ],
    },
    sendRowIdsInResponse: true,
    showColumnNamesInResponse: true,
  },
};

const beforeEachRun = async () => {
  jest.resetModules();
  process.env = { ...env };
  const { testGridId, firstRowId } = await bootstrapIntegrationTests();
  TEST_GRID_ID = testGridId;
  FIRST_ROW_ID = firstRowId;
};

const afterEachRun = async () => {
  await cleanupIntegrationTests(TEST_GRID_ID);
  process.env = env;
};

describe('Search', () => {
  beforeEach(() => beforeEachRun());
  afterEach(() => afterEachRun());
  describe('Positive Test Cases', () => {
    it('Should Return Grid Results', async () => {
      // Given
      const response = {
        totalRowCount: 1,
        rows: [
          {
            _id: FIRST_ROW_ID,
            'String Column': 'Example String',
            'Number Column': 1337,
            'Number 2 Column': 1234.5678,
            'Boolean Column': true,
            'Date Column': '2022-04-07',
            'Date Time Column': '2022-04-07 00:00:00.000',
            'Linked Column': '20171',
            'Linked Related Column From Other Grid': 'Related Column Value 1',
            'Formula Column': null,
            'Empty Column': null,
          },
        ],
      };

      // When
      const { data, error } = await search<TestGrid>(queryObject, TEST_GRID_ID);

      // Then
      expect(error).toEqual(undefined);
      expect(data).toEqual(response);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'System error. Please contact admin.',
        otherDetails: {},
        errorType: 'SYSTEMERROR',
        recoverable: false,
      };

      // When
      const { data, error } = await search<TestGrid>(
        queryObject,
        'INVALID_GRID_ID',
      );

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Share Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'share Id invalid',
        otherDetails: {},
        errorType: 'DATAERROR',
        recoverable: true,
      };

      // When
      const { data, error } = await search<TestGrid>(
        queryObject,
        TEST_GRID_ID,
        {
          shareId: 'INVALID_SHARE_ID',
        },
      );

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id in Production', async () => {
      // Given
      const errorObject = {
        errorMessage: 'authId is invalid',
        otherDetails: {},
        errorType: 'AUTHERROR',
        recoverable: true,
      };

      // When
      const { data, error } = await search<TestGrid>(
        queryObject,
        TEST_GRID_ID,
        {
          authId: 'INVALID_AUTHID',
        },
      );

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id in QA', async () => {
      // Given
      const errorObject = {
        errorMessage: 'authId is invalid',
        otherDetails: {},
        errorType: 'AUTHERROR',
        recoverable: true,
      };

      // When
      const { data, error } = await search<TestGrid>(
        queryObject,
        TEST_GRID_ID,
        {
          authId: 'INVALID_AUTHID',
          qa: true,
        },
      );

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
  });
});
