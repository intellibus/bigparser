import mockAxios from 'jest-mock-axios';
import { deleteByQuery, DeleteQueryObject } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { TEST_GRID_ID, BP_AUTH } = process.env;

describe('Delete By Query', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Should Return Grid Data', async () => {
      // Given
      // TODO: This response is not consistent with delete_by_rowIds endpoint's response.
      const gridResponse = {
        noOfRowsDeleted: 1,
      };

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

      // When
      const deleteByQueryPromise = deleteByQuery<TestGrid>(
        deleteQueryObject,
        TEST_GRID_ID
      );
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data: responseData, error: responseError } =
        await deleteByQueryPromise;

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
      expect(responseError).toEqual(undefined);
      expect(responseData).toEqual(gridResponse);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
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
      const errorObject = {
        err: {
          message: 'Invalid Grid Id',
          statusCode: 404,
        },
      };

      // When
      const deleteByQueryPromise = deleteByQuery(
        deleteQueryObject,
        'INVALID_GRID_ID'
      );
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } =
        await deleteByQueryPromise;

      // Then
      expect(mockAxios.delete).toHaveBeenCalledWith(
        'https://www.bigparser.com/api/v2/grid/INVALID_GRID_ID/rows/delete_by_queryObj',
        {
          headers: {
            authId: BP_AUTH,
          },
          data: deleteQueryObject,
        }
      );
      expect(responseData).toEqual(undefined);
      expect(responseError).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id', async () => {
      // Given
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
      const { data: responseData, error: responseError } =
        await deleteByQueryPromise;

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
      expect(responseData).toEqual(undefined);
      expect(responseError).toEqual(errorObject);
    });
  });
});
