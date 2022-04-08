import mockAxios from 'jest-mock-axios';
import { updateByRowId, UpdateRowIdObject } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const updateRowIdObject: UpdateRowIdObject<TestGrid> = {
  update: {
    rows: [
      {
        rowId: '6243cd4ec9d082361703ea4e',
        columns: {
          'String Column': 'Example String 1',
        },
      },
    ],
  },
};

describe('Update By Row Id', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Number of Rows & Row Ids of Rows Updated', async () => {
      // Given
      const response = {
        noOfRowsUpdated: 1,
        noOfRowsFailed: 0,
        updatedRows: ['6243cd4ec9d082361703ea4e'],
        failedRows: {},
      };

      // When
      const updateByRowIdPromise = updateByRowId<TestGrid>(
        updateRowIdObject,
        TEST_GRID_ID
      );
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await updateByRowIdPromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/update_by_rowIds`,
        updateRowIdObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(error).toEqual(undefined);
      expect(data).toEqual(response);
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
      const updateByRowIdPromise = updateByRowId<TestGrid>(
        updateRowIdObject,
        TEST_GRID_ID,
        { authId: 'INVALID_AUTHID' }
      );
      mockAxios.mockError(errorObject);
      const { data, error } = await updateByRowIdPromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/update_by_rowIds`,
        updateRowIdObject,
        {
          headers: {
            authId: 'INVALID_AUTHID',
          },
        }
      );
      expect(data).toEqual(undefined);
      expect(error).toEqual(errorObject);
    });
  });
});
