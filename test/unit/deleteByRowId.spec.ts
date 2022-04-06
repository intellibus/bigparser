import mockAxios from 'jest-mock-axios';
import { deleteByRowId } from '../../src/index';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const deleteRowIdObject = {
  delete: {
    rows: [
      {
        rowId: '6243cd4ec9d082361703ea4e',
      },
    ],
  },
};

describe('Delete By Row Id', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Number of Rows Deleted', async () => {
      // Given
      const gridResponse = {
        noOfRowsDeleted: 1,
        noOfRowsFailed: 0,
        deletedRows: ['6243cd4ec9d082361703ea4e'],
        failedRows: {},
      };

      // When
      const deleteByRowIdPromise = deleteByRowId(
        deleteRowIdObject,
        TEST_GRID_ID
      );
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data, error } = await deleteByRowIdPromise;

      // Then
      expect(mockAxios.delete).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/delete_by_rowIds`,
        {
          headers: {
            authId: BP_AUTH,
          },
          data: deleteRowIdObject,
        }
      );
      expect(error).toEqual(undefined);
      expect(data).toEqual(gridResponse);
    });
  });
  describe('Negative Test Cases', () => {
    it('Rejects Invalid Auth Id', async () => {
      // Given
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
        { authId: 'INVALID_AUTHID' }
      );
      mockAxios.mockError(errorObject);
      const { data, error } = await deleteByRowIdPromise;

      // Then
      expect(mockAxios.delete).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/delete_by_rowIds`,
        {
          headers: {
            authId: 'INVALID_AUTHID',
          },
          data: deleteRowIdObject,
        }
      );
      expect(data).toEqual(undefined);
      expect(error).toEqual(errorObject);
    });
  });
});
