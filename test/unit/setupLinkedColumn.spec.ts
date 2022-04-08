import mockAxios from 'jest-mock-axios';
import { setupLinkedColumn, SetupLinkedColumnObject } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';
import { TestGrid2 } from '../__grids__/TestGrid2';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const TEST_GRID_ID_2 = 'VALID_GRID_ID_2';
const setupLinkedColumnObject: SetupLinkedColumnObject<TestGrid, TestGrid2> = {
  destinationColumnName: 'Linked Column',
  destinationGridId: TEST_GRID_ID,
  linkedRelatedColumns: [
    {
      destColName: 'Linked Related Column From Other Grid',
      srcColName: 'Linked Related Column',
    },
  ],
  sourceColumnName: 'Source Column',
  sourceGridId: TEST_GRID_ID_2,
};

describe('Set Up Linked Column', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Metadata of Configured Linked Columns', async () => {
      // Given
      const response = '';

      // When
      const setupLinkedColumnPromise = setupLinkedColumn<TestGrid, TestGrid2>(
        setupLinkedColumnObject
      );
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await setupLinkedColumnPromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/setup_linked_column`,
        setupLinkedColumnObject,
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
      const setupLinkedColumnPromise = setupLinkedColumn<TestGrid, TestGrid2>(
        setupLinkedColumnObject,
        {
          authId: 'INVALID_AUTHID',
        }
      );
      mockAxios.mockError(errorObject);
      const { data, error } = await setupLinkedColumnPromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/setup_linked_column`,
        setupLinkedColumnObject,
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
