import { AxiosError } from 'axios';
import {
  insert
} from '../../src/index';
import {
  TestGrid
} from '../__grids__/TestGrid';
import {
  InsertObject
} from '../../src/types'
import { createGrids, removeGrid } from './integrationTestUtils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

let testGridTab1Id: string;

const insertObject: InsertObject<TestGrid> = {
  insert: {
    rows: [
      {
        'String Column': 'Example String'
      }
    ]
  },
};

const beforeEachWrapper = async () => {
  jest.resetModules();
  [testGridTab1Id] = await createGrids();
}

describe('Insert', () => {
  beforeEach(() => beforeEachWrapper());
  afterEach(() => removeGrid(testGridTab1Id));
  describe('Positive Test Cases', () => {
    it('Should Insert Successfully', async () => {
      // Given
      const response = {
        noOfRowsCreated: 1,
        noOfRowsFailed: 0,
        // Also contains a createdRows key
        failedRows: {}
      };

      // When
      const { data: responseData, error: responseError } = await insert<TestGrid>(insertObject, testGridTab1Id);

      // Then
      expect(responseError).toEqual(undefined);
      expect(responseData).toMatchObject(response);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'System error. Please contact admin.',
        otherDetails: {},
        errorType: 'SYSTEMERROR',
        recoverable: false
      };

      // When
      const { data: responseData, error: responseError } = await insert<TestGrid>(insertObject, 'INVALID_GRID_ID');

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
        recoverable: true
      };

      // When
      const { data: responseData, error: responseError } = await insert<TestGrid>(insertObject, testGridTab1Id, {
        viewId: 'INVALID_VIEW_ID',
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
        recoverable: true
      };

      // When
      const { data: responseData, error: responseError } = await insert<TestGrid>(insertObject, testGridTab1Id, {
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
        recoverable: true
      };

      // When
      const { data: responseData, error: responseError } = await insert<TestGrid>(insertObject, testGridTab1Id, {
        authId: 'INVALID_AUTHID',
        qa: true
      });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
  });
});