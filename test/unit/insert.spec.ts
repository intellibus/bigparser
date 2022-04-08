import mockAxios from 'jest-mock-axios';
import { insert, InsertObject } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const insertObject: InsertObject<TestGrid> = {
  insert: {
    rows: [
      {
        'String Column': 'Example String 2',
        'Boolean Column': false,
      },
    ],
  },
};

describe('Insert', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Number of Rows & Row Ids of Rows Created', async () => {
      // Given
      const response = {
        noOfRowsCreated: 1,
        noOfRowsFailed: 0,
        createdRows: {
          0: '6245fdd8c9d082361704be38',
        },
        failedRows: {},
      };

      // When
      const insertPromise = insert<TestGrid>(insertObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await insertPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/create`,
        insertObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        },
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
      const insertPromise = insert<TestGrid>(insertObject, TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
      });
      mockAxios.mockError(errorObject);
      const { data, error } = await insertPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/create`,
        insertObject,
        {
          headers: {
            authId: 'INVALID_AUTHID',
          },
        },
      );
      expect(data).toEqual(undefined);
      expect(error).toEqual(errorObject);
    });
  });
});
