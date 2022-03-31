import mockAxios from 'jest-mock-axios';
import { insert, InsertObject } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { TEST_GRID_ID, BP_AUTH } = process.env;

describe('Insert', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Should insert new row', async () => {
      // Given
      const gridResponse = {
        noOfRowsCreated: 1,
        noOfRowsFailed: 0,
        createdRows: {
          0: '6245fdd8c9d082361704be38',
        },
        failedRows: {},
      };
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

      // When
      const insertPromise = insert<TestGrid>(insertObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data: responseData, error: responseError } = await insertPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/create`,
        insertObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(responseError).toEqual(undefined);
      expect(responseData).toEqual(gridResponse);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
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
      const errorObject = {
        err: {
          message: 'Invalid Grid Id',
          statusCode: 404,
        },
      };

      // When
      const insertPromise = insert<TestGrid>(insertObject, '');
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } = await insertPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://www.bigparser.com/api/v2/grid//rows/create',
        insertObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(responseData).toEqual(undefined);
      expect(responseError).toEqual(errorObject);
    });
    it('Should Reject Invalid View Id', async () => {
      // Given
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
      const errorObject = {
        err: {
          message: 'Invalid View Id',
          statusCode: 404,
        },
      };

      // When
      const insertPromise = insert<TestGrid>(insertObject, TEST_GRID_ID, '');
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } = await insertPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/create`,
        insertObject,
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
      const errorObject = {
        err: {
          message: 'Invalid Auth Id',
          statusCode: 403,
        },
      };

      // When
      const insertPromise = insert<TestGrid>(
        insertObject,
        TEST_GRID_ID,
        '',
        'INVALID_AUTHID'
      );
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } = await insertPromise;
      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows/create`,
        insertObject,
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
