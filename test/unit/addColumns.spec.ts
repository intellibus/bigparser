import mockAxios from 'jest-mock-axios';
import { addColumns, AddColumnsObject } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const addColumnObject: AddColumnsObject<TestGrid> = {
  newColumns: [
    {
      columnName: 'New Column 1',
    },
    {
      columnName: 'New Column 2',
    },
  ],
  afterColumn: {
    columnName: 'Date Column',
  },
};

describe('Add Columns', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Columns Created', async () => {
      // Given
      const response = [
        {
          columnIndex: '11',
          columnName: 'New Column 1',
        },
        {
          columnIndex: '12',
          columnName: 'New Column 2',
        },
      ];

      // When
      const addColumnPromise = addColumns<TestGrid>(
        addColumnObject,
        TEST_GRID_ID,
      );
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await addColumnPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/add_columns`,
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
      const addColumnPromise = addColumns<TestGrid>(
        addColumnObject,
        TEST_GRID_ID,
        { authId: 'INVALID_AUTHID' },
      );
      mockAxios.mockError(errorObject);
      const { data, error } = await addColumnPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/add_columns`,
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
