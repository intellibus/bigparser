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

      const deleteObject = {
        delete: {
          rows: [
            {
              rowId: '6243cd4ec9d082361703ea4e'
            }
          ]
        }
      };

      // When
      const deleteByRowIdPromise = deleteByRowId(deleteObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data: responseData, error: responseError } = await deleteByRowIdPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/delete_by_rowIds`,
        deleteObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(responseError).toEqual(undefined);
      expect(responseData).toEqual(gridResponse);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
      const deleteObject = {
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
      const deleteByRowIdPromise = deleteByRowId(deleteObject, '');
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } = await deleteByRowIdPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://www.bigparser.com/api/v2/grid//delete_by_rowIds',
        deleteObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(responseData).toEqual(undefined);
      expect(responseError).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id', async () => {
      // Given
      const deleteObject = {
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
        deleteObject,
        TEST_GRID_ID,
        '',
        'INVALID_AUTHID'
      );
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } = await deleteByRowIdPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search`,
        deleteObject,
        {
          headers: {
            authId: 'INVALID_AUTHID',
          },
        }
      );
      expect(responseData).toEqual(undefined);
      expect(responseError).toEqual(errorObject);
    });
  });
});
