import mockAxios from 'jest-mock-axios';
import { searchDistinct, QueryDistinctObject } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const queryDistinctObject: QueryDistinctObject<TestGrid> = {
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

describe('Search Distinct', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns List of Distinct Values as Result of Query', async () => {
      // Given
      const response = {
        matchingValues: ['Example String'],
      };

      // When
      const searchDistinctPromise = searchDistinct<TestGrid>(
        queryDistinctObject,
        TEST_GRID_ID
      );
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await searchDistinctPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/distinct`,
        queryDistinctObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(data).toEqual(response);
      expect(error).toEqual(undefined);
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
      const searchDistinctPromise = searchDistinct<TestGrid>(
        queryDistinctObject,
        TEST_GRID_ID,
        { authId: 'INVALID_AUTHID' }
      );
      mockAxios.mockError(errorObject);
      const { data, error } = await searchDistinctPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/distinct`,
        queryDistinctObject,
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
