import mockAxios from 'jest-mock-axios';
import { searchCount } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const queryObject = {
  query: {},
};

describe('Search Count', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Total Number of Rows as Result of Query', async () => {
      // Given
      const gridResponse = { totalRowCount: 1 };

      // When
      const searchPromise = searchCount<TestGrid>(queryObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data, error } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search_count`,
        queryObject,
        {
          headers: {
            authId: BP_AUTH,
          },
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
      const searchPromise = searchCount<TestGrid>(queryObject, TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
      });
      mockAxios.mockError(errorObject);
      const { data, error } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search_count`,
        queryObject,
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
