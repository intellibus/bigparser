import mockAxios from 'jest-mock-axios';
import { searchCount } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { TEST_GRID_ID, BP_AUTH } = process.env;

describe('Search Count', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Should Return Number Of Records In Grid', async () => {
      // Given
      const gridResponse = { totalRowCount: 1 };

      const queryObject = {
        query: {},
      };

      // When
      const searchPromise = searchCount<TestGrid>(queryObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data: responseData, error: responseError } = await searchPromise;

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
      expect(responseError).toEqual(undefined);
      expect(responseData).toEqual(gridResponse);
    });
    // TO DO
    // it('Should Return Number Of Records In Grid When Valid View Id', async () => {
    // });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
      const queryObject = {
        query: {},
      };
      const errorObject = {
        err: {
          message: 'Invalid Grid Id',
          statusCode: 404,
        },
      };

      // When
      const searchPromise = searchCount<TestGrid>(
        queryObject,
        'INVALID_GRID_ID'
      );
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://www.bigparser.com/api/v2/grid/INVALID_GRID_ID/search_count',
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
      const queryObject = {
        query: {},
      };
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
      const { data: responseData, error: responseError } = await searchPromise;

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
      expect(responseData).toEqual(undefined);
      expect(responseError).toEqual(errorObject);
    });
  });
});
