import { AxiosError } from 'axios';
import { deleteByRowId } from '../../src/index';
import { DeleteRowIdObject } from '../../src/types';
import { createGrids, removeGrid } from './integrationTestUtils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

let testGridTab1Id: string;
let row1Id: string;

const updateRowIdObject: DeleteRowIdObject = {
  delete: {
    rows: [
      {
        rowId: row1Id,
      },
    ],
  },
};

const beforeEachWrapper = async () => {
  jest.resetModules();
  [testGridTab1Id, , row1Id] = await createGrids();
  updateRowIdObject.delete.rows[0].rowId = row1Id;
};

describe('Delete By Row Id', () => {
  beforeEach(() => beforeEachWrapper());
  afterEach(() => removeGrid(testGridTab1Id));
  describe('Positive Test Cases', () => {
    it('Should Delete Successfully', async () => {
      // Given
      const response = {
        noOfRowsDeleted: 1,
        noOfRowsFailed: 0,
        deletedRows: [row1Id],
        failedRows: {},
      };

      // When
      const { data: responseData, error: responseError } = await deleteByRowId(
        updateRowIdObject,
        testGridTab1Id
      );

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
      const { data: responseData, error: responseError } = await deleteByRowId(
        updateRowIdObject,
        'INVALID_GRID_ID'
      );

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
      const { data: responseData, error: responseError } = await deleteByRowId(
        updateRowIdObject,
        testGridTab1Id,
        {
          shareId: 'INVALID_VIEW_ID',
        }
      );

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
      const { data: responseData, error: responseError } = await deleteByRowId(
        updateRowIdObject,
        testGridTab1Id,
        {
          authId: 'INVALID_AUTHID',
        }
      );

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
      const { data: responseData, error: responseError } = await deleteByRowId(
        updateRowIdObject,
        testGridTab1Id,
        {
          authId: 'INVALID_AUTHID',
          qa: true,
        }
      );

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
  });
});
