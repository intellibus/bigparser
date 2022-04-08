import mockAxios from 'jest-mock-axios';
import {
  updateColumnDatatype,
  UpdateColumnDatatypeObject,
} from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const updateColumnDatatypeObject: UpdateColumnDatatypeObject<TestGrid> = {
  columns: [
    {
      columnName: 'Empty Column',
      dataType: 'NUMBER',
    },
  ],
};

describe('Update Column Datatype', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Job Id of Data Fix Job to Update Column Datatype', async () => {
      // Given
      const response = {
        dataFixId: '6245fd56c9d082361704bdd3',
        message:
          "Please use 'fix_data_type_of_existing_data/status'" +
          ' api to check the status.',
      };

      // When
      const updateColumnDatatypePromise = updateColumnDatatype<TestGrid>(
        updateColumnDatatypeObject,
        TEST_GRID_ID
      );
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await updateColumnDatatypePromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/update_column_datatype`,
        updateColumnDatatypeObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
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
      const updateColumnDatatypePromise = updateColumnDatatype<TestGrid>(
        updateColumnDatatypeObject,
        TEST_GRID_ID,
        { authId: 'INVALID_AUTHID' }
      );
      mockAxios.mockError(errorObject);
      const { data, error } = await updateColumnDatatypePromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/update_column_datatype`,
        updateColumnDatatypeObject,
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
