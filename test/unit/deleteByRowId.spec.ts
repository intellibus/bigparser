import mockAxios from 'jest-mock-axios';
import { deleteByRowId } from '../../src/index';

const { TEST_GRID_ID, BP_AUTH } = process.env;

describe('DeleteByRowId', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Should Return Grid Data', async () => {
      // Given
      const gridResponse = {
        noOfRowsDeleted: 1,
        noOfRowsFailed: 0,
        deletedRows: [
            '6243cd4ec9d082361703ea4e'
        ],
        failedRows: {}
      };

      const deleteRowIdObject = {
        delete: {
          rows: [
            {
              rowId: '6243cd4ec9d082361703ea4e'
            }
          ]
        }
      };

      // When
      const deleteByRowIdPromise = deleteByRowId(deleteRowIdObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data: responseData, error: responseError } = await deleteByRowIdPromise;

      // Then
      expect(mockAxios.delete).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/delete_by_rowIds`,
        {
          headers: {
            authId: BP_AUTH,
          },
          data: deleteRowIdObject
        }
      );
      expect(responseError).toEqual(undefined);
      expect(responseData).toEqual(gridResponse);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
      const deleteRowIdObject = {
        delete: {
          rows: [
            {
              rowId: '6243cd4ec9d082361703ea4e'
            }
          ]
        }
      };
      const errorObject = {
        err: {
          message: 'Invalid Grid Id',
          statusCode: 404,
        },
      };

      // When
      const deleteByRowIdPromise = deleteByRowId(deleteRowIdObject, '');
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } = await deleteByRowIdPromise;

      // Then
      expect(mockAxios.delete).toHaveBeenCalledWith(
        'https://www.bigparser.com/api/v2/grid//rows/delete_by_rowIds',
        {
          headers: {
            authId: BP_AUTH,
          },
          data: deleteRowIdObject
        }
      );
      expect(responseData).toEqual(undefined);
      expect(responseError).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id', async () => {
      // Given
      const deleteRowIdObject = {
        delete: {
          rows: [
            {
              rowId: '6243cd4ec9d082361703ea4e'
            }
          ]
        }
      };
      const errorObject = {
        err: {
          message: 'Invalid Auth Id',
          statusCode: 403,
        },
      };

      // When
      const deleteByRowIdPromise = deleteByRowId(
        deleteRowIdObject,
        TEST_GRID_ID,
        '',
        'INVALID_AUTHID'
      );
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } = await deleteByRowIdPromise;

      // Then
      expect(mockAxios.delete).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/delete_by_rowIds`,
        {
          headers: {
            authId: 'INVALID_AUTHID',
          },
          data: deleteRowIdObject
        }
      );
      expect(responseData).toEqual(undefined);
      expect(responseError).toEqual(errorObject);
    });
  });
});
