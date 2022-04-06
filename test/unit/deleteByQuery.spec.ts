import mockAxios from 'jest-mock-axios';
import { deleteByQuery, DeleteQueryObject } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const deleteQueryObject: DeleteQueryObject<TestGrid> = {
  delete: {
    query: {
      columnFilter: {
        filters: [
          {
            column: 'String Column',
            operator: 'EQ',
            keyword: 'Example String',
          },
        ],
      },
    },
  },
};

describe('Delete By Query', () => {
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
      };

      // When
      const deleteByQueryPromise = deleteByQuery<TestGrid>(
        deleteQueryObject,
        TEST_GRID_ID
      );
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data, error } = await deleteByQueryPromise;

      // Then
      expect(mockAxios.delete).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/delete_by_queryObj`,
        {
          headers: {
            authId: BP_AUTH,
          },
          data: deleteQueryObject,
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
      const deleteByQueryPromise = deleteByQuery(
        deleteQueryObject,
        TEST_GRID_ID,
        { authId: 'INVALID_AUTHID' }
      );
      mockAxios.mockError(errorObject);
      const { data, error } = await deleteByQueryPromise;

      // Then
      expect(mockAxios.delete).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/delete_by_queryObj`,
        {
          headers: {
            authId: 'INVALID_AUTHID',
          },
          data: deleteQueryObject,
        }
      );
      expect(data).toEqual(undefined);
      expect(error).toEqual(errorObject);
    });
  });
});
