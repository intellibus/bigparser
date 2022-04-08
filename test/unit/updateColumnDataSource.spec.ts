import mockAxios from 'jest-mock-axios';
import {
  updateColumnDataSource,
  UpdateColumnDataSourceObject,
} from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const updateColumnDataSourceObject: UpdateColumnDataSourceObject<TestGrid> = {
  columns: [
    {
      columnDataSource: {
        columnNames: ['Number Column', 'Number 2 Column'],
        functionType: 'AVG',
      },
      columnName: 'Formula Column',
    },
  ],
};

describe('Update Column Data Source', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Metadata of Updated Column', async () => {
      // Given
      const response = '';

      // When
      const updateColumnDataSourcePromise = updateColumnDataSource<TestGrid>(
        updateColumnDataSourceObject,
        TEST_GRID_ID,
      );
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await updateColumnDataSourcePromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/update_column_dataSource`,
        updateColumnDataSourceObject,
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
      const updateColumnDataSourcePromise = updateColumnDataSource<TestGrid>(
        updateColumnDataSourceObject,
        TEST_GRID_ID,
        {
          authId: 'INVALID_AUTHID',
        },
      );
      mockAxios.mockError(errorObject);
      const { data, error } = await updateColumnDataSourcePromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/update_column_dataSource`,
        updateColumnDataSourceObject,
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
