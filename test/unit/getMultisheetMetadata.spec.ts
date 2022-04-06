import mockAxios from 'jest-mock-axios';
import { getMultisheetMetadata } from '../../src/index';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';

describe('Get Multisheet Metadata', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Metadata for Tabs of Grid', async () => {
      // Given
      const gridResponse = {
        grids: [
          {
            gridId: '62448f82c9d0822ec669f83b',
            name: 'Test Tab',
            tabName: 'Test Tab',
            tabDescription: null,
            pinned: false,
          },
          {
            gridId: '6244901dc9d0823617041966',
            name: 'Linked Data Tab',
            tabName: 'Linked Data Tab',
            tabDescription: null,
            pinned: false,
          },
        ],
      };

      // When
      const getMultisheetMetadataPromise = getMultisheetMetadata(TEST_GRID_ID);
      mockAxios.mockResponse({ data: gridResponse });
      const { data, error } = await getMultisheetMetadataPromise;

      // Then
      expect(mockAxios.get).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/query_multisheet_metadata`,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(error).toEqual(undefined);
      expect(data).toEqual(gridResponse);
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
      const getMultisheetMetadataPromise = getMultisheetMetadata(TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
      });
      mockAxios.mockError(errorObject);
      const { data, error } = await getMultisheetMetadataPromise;

      // Then
      expect(mockAxios.get).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/query_multisheet_metadata`,
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
