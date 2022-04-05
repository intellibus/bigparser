import { AxiosError } from 'axios';
import { search } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';
import { QueryObject } from '../../src/types';
import { createGrids, removeGrid } from './integrationTestUtils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

let testGridTab1Id: string;
let row1Id: string;

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

const beforeEachWrapper = async () => {
  jest.resetModules();
  [testGridTab1Id, , row1Id] = await createGrids();
};

describe('Search', () => {
  beforeEach(() => beforeEachWrapper());
  afterEach(() => removeGrid(testGridTab1Id));
  describe('Positive Test Cases', () => {
    it('Should Return Grid Results', async () => {
      // Given
      const response = {
        totalRowCount: 1,
        rows: [
          {
            _id: row1Id,
            'String Column': 'Example String',
            'Number Column': 1337,
            'Number 2 Column': 1234.5678,
            'Boolean Column': true,
            'Date Column': '2022-04-04 12:15:30.000',
            'Linked Column': '20171',
            'Linked Related Column From Other Grid': null,
            'Formula Column': null,
            'Empty Column': null,
          },
        ],
      };

      // When
      const { data: responseData, error: responseError } =
        await search<TestGrid>(queryObject, testGridTab1Id);

      // Then
      expect(responseError).toEqual(undefined);
      expect(responseData).toEqual(response);
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
      const { data: responseData, error: responseError } =
        await search<TestGrid>(queryObject, 'INVALID_GRID_ID');

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid View Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'share Id invalid',
        otherDetails: {},
        errorType: 'DATAERROR',
        recoverable: true,
      };

      // When
      const { data: responseData, error: responseError } =
        await search<TestGrid>(queryObject, testGridTab1Id, {
          shareId: 'INVALID_VIEW_ID',
        });
      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id (prod)', async () => {
      // Given
      const errorObject = {
        errorMessage: 'authId is invalid',
        otherDetails: {},
        errorType: 'AUTHERROR',
        recoverable: true,
      };

      // When
      const { data: responseData, error: responseError } =
        await search<TestGrid>(queryObject, testGridTab1Id, {
          authId: 'INVALID_AUTHID',
        });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id (qa)', async () => {
      // Given
      const errorObject = {
        errorMessage: 'authId is invalid',
        otherDetails: {},
        errorType: 'AUTHERROR',
        recoverable: true,
      };

      // When
      const { data: responseData, error: responseError } =
        await search<TestGrid>(queryObject, testGridTab1Id, {
          authId: 'INVALID_AUTHID',
          qa: true,
        });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
  });
});
