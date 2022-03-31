import mockAxios from 'jest-mock-axios';
import { getMultisheetMetadata } from '../../src/index';

const { TEST_GRID_ID, BP_AUTH } = process.env;

describe('GetHeaders', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Should Return Grid Data', async () => {
      // Given
      const gridResponse = {
        grids: [
          {
            gridId: '62448f82c9d0822ec669f83b',
            name: 'Test Tab',
            tabName: 'Test Tab',
            tabDescription: null,
            pinned: false
          },
          {
            gridId: '6244901dc9d0823617041966',
            name: 'Linked Data Tab',
            tabName: 'Linked Data Tab',
            tabDescription: null,
            pinned: false
          }
        ]
      }

      // When
      const searchPromise = getMultisheetMetadata(TEST_GRID_ID);
      mockAxios.mockResponse({ data: gridResponse });
      const { data: searchData, error: searchError } = await searchPromise;

      // Then
      expect(mockAxios.get).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/query_multisheet_metadata`,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(searchError).toEqual(undefined);
      expect(searchData).toEqual(gridResponse);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
      const errorObject = {
        err: {
          message: 'Invalid Grid Id',
          statusCode: 404,
        },
      };

      // When
      const searchPromise = getMultisheetMetadata('');
      mockAxios.mockError(errorObject);
      const { data: searchData, error: searchError } = await searchPromise;

      // Then
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.bigparser.com/api/v2/grid//query_multisheet_metadata',
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(searchData).toEqual(undefined);
      expect(searchError).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id', async () => {
      // Given
      const errorObject = {
        err: {
          message: 'Invalid Auth Id',
          statusCode: 403,
        },
      };

      // When
      const searchPromise = getMultisheetMetadata(
        TEST_GRID_ID,
        '',
        'INVALID_AUTHID'
      );
      mockAxios.mockError(errorObject);
      const { data: searchData, error: searchError } = await searchPromise;

      // Then
      expect(mockAxios.get).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/query_multisheet_metadata`,
        {
          headers: {
            authId: 'INVALID_AUTHID',
          },
        }
      );
      expect(searchData).toEqual(undefined);
      expect(searchError).toEqual(errorObject);
    });
  });
});
