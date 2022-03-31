import mockAxios from 'jest-mock-axios';
import { updateByQuery, QueryUpdateObject } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { TEST_GRID_ID, BP_AUTH } = process.env;

describe('Update By Query', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Should Return No of Rows Updated by the Query', async () => {
      // Given
      const gridResponse = {
        noOfRowsUpdated: 1,
      };

      const queryObject: QueryUpdateObject<TestGrid> = {
        update: {
          columns: {
            'Number Column': 123,
          },
        },
        query: {
          globalFilter: {
            filters: [
              {
                operator: 'LIKE',
                keyword: 'Example',
              },
            ],
          },
        },
      };

      // When
      const updateByQueryPromise = updateByQuery<TestGrid>(
        queryObject,
        TEST_GRID_ID
      );
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data: responseData, error: responseError } =
        await updateByQueryPromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/update_by_queryObj`,
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
      const queryObject: QueryUpdateObject<TestGrid> = {
        update: {
          columns: {
            'Number Column': 123,
          },
        },
        query: {
          globalFilter: {
            filters: [
              {
                operator: 'LIKE',
                keyword: 'Example',
              },
            ],
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
      const updateByQueryPromise = updateByQuery<TestGrid>(queryObject, '');
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } =
        await updateByQueryPromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid//rows/update_by_queryObj`,
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
      const queryObject: QueryUpdateObject<TestGrid> = {
        update: {
          columns: {
            'Number Column': 123,
          },
        },
        query: {
          globalFilter: {
            filters: [
              {
                operator: 'LIKE',
                keyword: 'Example',
              },
            ],
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
      const updateByQueryPromise = updateByQuery<TestGrid>(
        queryObject,
        TEST_GRID_ID,
        '',
        'INVALID_AUTHID'
      );
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } =
        await updateByQueryPromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/update_by_queryObj`,
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
