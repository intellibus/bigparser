import mockAxios from 'jest-mock-axios';
import { updateByQuery, QueryUpdateObject } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const queryUpdateObject: QueryUpdateObject<TestGrid> = {
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

describe('Update By Query', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Number of Rows Updated', async () => {
      // Given
      const gridResponse = {
        noOfRowsUpdated: 1,
      };

      // When
      const updateByQueryPromise = updateByQuery<TestGrid>(
        queryUpdateObject,
        TEST_GRID_ID
      );
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data, error } = await updateByQueryPromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/update_by_queryObj`,
        queryUpdateObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(data).toEqual(gridResponse);
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
      const updateByQueryPromise = updateByQuery<TestGrid>(
        queryUpdateObject,
        TEST_GRID_ID,
        { authId: 'INVALID_AUTHID' }
      );
      mockAxios.mockError(errorObject);
      const { data, error } = await updateByQueryPromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/update_by_queryObj`,
        queryUpdateObject,
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
