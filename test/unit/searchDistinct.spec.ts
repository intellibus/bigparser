import mockAxios from 'jest-mock-axios';
import { searchDistinct, QueryDistinctObject } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { TEST_GRID_ID, BP_AUTH } = process.env;

describe('Search Distinct', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Should Return Matching Distinct Values from Grid Data', async () => {
      // Given
      const gridResponse = {
        matchingValues: ['Example String'],
      };

      const queryObject: QueryDistinctObject<TestGrid> = {
        query: {
          columnFilter: {
            filters: [
              {
                column: 'String Column',
                operator: 'LIKE',
                keyword: 'Example',
              },
            ],
          },
        },
        distinct: {
          columnNames: ['String Column'],
        },
      };

      // When
      const searchDistinctPromise = searchDistinct<TestGrid>(
        queryObject,
        TEST_GRID_ID
      );
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data: responseData, error: responseError } =
        await searchDistinctPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/distinct`,
        queryObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(responseData).toEqual(gridResponse);
      expect(responseError).toEqual(undefined);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
      const queryObject: QueryDistinctObject<TestGrid> = {
        query: {
          columnFilter: {
            filters: [
              {
                column: 'String Column',
                operator: 'LIKE',
                keyword: 'Example',
              },
            ],
          },
        },
        distinct: {
          columnNames: ['String Column'],
        },
      };
      const errorObject = {
        err: {
          message: 'Invalid Grid Id',
          statusCode: 404,
        },
      };

      // When
      const searchDistinctPromise = searchDistinct<TestGrid>(
        queryObject,
        'INVALID_GRID_ID'
      );
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } =
        await searchDistinctPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/INVALID_GRID_ID/distinct`,
        queryObject,
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
      const queryObject: QueryDistinctObject<TestGrid> = {
        query: {
          columnFilter: {
            filters: [
              {
                column: 'String Column',
                operator: 'LIKE',
                keyword: 'Example',
              },
            ],
          },
        },
        distinct: {
          columnNames: ['String Column'],
        },
      };
      const errorObject = {
        err: {
          message: 'Invalid Auth Id',
          statusCode: 403,
        },
      };

      // When
      const searchDistinctPromise = searchDistinct<TestGrid>(
        queryObject,
        TEST_GRID_ID,
        { authId: 'INVALID_AUTHID' }
      );
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } =
        await searchDistinctPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/distinct`,
        queryObject,
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
