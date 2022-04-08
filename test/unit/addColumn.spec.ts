import mockAxios from 'jest-mock-axios';
import { addColumn, AddColumnObject } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const addColumnObject: AddColumnObject<TestGrid> = {
  newColumnName: 'New Column',
  afterColumn: {
    columnName: 'Date Column',
  },
};

describe('Add Column', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Number of Columns Created', async () => {
      // Given
      const response = {
        insertColumns: [
          {
            noOfColumnsUpdated: 1,
          },
        ],
      };

      // When
      const addColumnPromise = addColumn<TestGrid>(
        addColumnObject,
        TEST_GRID_ID,
      );
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await addColumnPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/add_column`,
        addColumnObject,
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
      const addColumnPromise = addColumn<TestGrid>(
        addColumnObject,
        TEST_GRID_ID,
        { authId: 'INVALID_AUTHID' },
      );
      mockAxios.mockError(errorObject);
      const { data, error } = await addColumnPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/add_column`,
        addColumnObject,
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
