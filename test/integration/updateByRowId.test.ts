import { AxiosError } from 'axios';
import {
  updateByRowId
} from '../../src/index';
import {
  TestGrid
} from '../__grids__/TestGrid';
import {
  UpdateRowIdObject
} from '../../src/types'
import { createGrids, removeGrid } from './integrationTestUtils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

let testGridTab1Id: string;
let row1Id: string;

const updateRowIdObject: UpdateRowIdObject<TestGrid> = {
  update: {
    rows: [
      {
        rowId: row1Id,
        columns: {
          'Boolean Column': false
        }
      }
    ]
  },
};

const beforeEachWrapper = async () => {
  jest.resetModules();
  [testGridTab1Id, , row1Id] = await createGrids();
  updateRowIdObject.update.rows[0].rowId = row1Id;
}

describe('Update By Row Id', () => {
  beforeEach(() => beforeEachWrapper());
  afterEach(() => removeGrid(testGridTab1Id));
  describe('Positive Test Cases', () => {
    it('Should Update Successfully', async () => {
      // Given
      const response = {
        noOfRowsUpdated: 1,
        noOfRowsFailed: 0,
        updatedRows: [
          row1Id
        ],
        failedRows: {}
      };

      // When
      const { data: responseData, error: responseError } = await updateByRowId<TestGrid>(updateRowIdObject, testGridTab1Id);

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
        recoverable: false
      };

      // When
      const { data: responseData, error: responseError } = await updateByRowId<TestGrid>(updateRowIdObject, 'INVALID_GRID_ID');

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
      const { data: responseData, error: responseError } = await updateByRowId<TestGrid>(updateRowIdObject, testGridTab1Id, {
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
      const { data: responseData, error: responseError } = await updateByRowId<TestGrid>(updateRowIdObject, testGridTab1Id, {
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
      const { data: responseData, error: responseError } = await updateByRowId<TestGrid>(updateRowIdObject, testGridTab1Id, {
        authId: 'INVALID_AUTHID',
        qa: true
      });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
  });
});