import mockAxios from 'jest-mock-axios';
import { createGrid, CreateGridObject } from '../../src/index';

const { BP_AUTH } = process.env;
const createGridObject: CreateGridObject = {
  gridName: 'New Grid',
  gridTabs: [
    {
      tabName: 'New Tab',
    },
  ],
};

describe('Create Grid', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Grid Id of Created Grid', async () => {
      // Given
      const response = {
        gridId: '624c8267c9d08236170650a5',
      };

      // When
      const createGridPromise = createGrid(createGridObject);
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await createGridPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://www.bigparser.com/api/v2/grid/create_grid',
        createGridObject,
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
      const createGridPromise = createGrid(createGridObject, {
        authId: 'INVALID_AUTHID',
      });
      mockAxios.mockError(errorObject);
      const { data, error } = await createGridPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://www.bigparser.com/api/v2/grid/create_grid',
        createGridObject,
        {
          headers: {
            authId: 'INVALID_AUTHID',
          },
        }
      );
      expect(error).toEqual(errorObject);
      expect(data).toEqual(undefined);
    });
  });
});
