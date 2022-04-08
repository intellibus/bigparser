import mockAxios from 'jest-mock-axios';
import { getMultisheetMetadata } from '../../src/index';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const LINKED_DATA_TAB_GRID_ID = 'VALID_GRID_ID_2';

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
      const response = {
        grids: [
          {
            gridId: TEST_GRID_ID,
            name: 'Test Tab',
            tabName: 'Test Tab',
            tabDescription: null,
            pinned: false,
          },
          {
            gridId: LINKED_DATA_TAB_GRID_ID,
            name: 'Linked Data Tab',
            tabName: 'Linked Data Tab',
            tabDescription: null,
            pinned: false,
          },
        ],
      };

      // When
      const getMultisheetMetadataPromise = getMultisheetMetadata(TEST_GRID_ID);
      mockAxios.mockResponse({ data: response });
      const { data, error } = await getMultisheetMetadataPromise;

      // Then
      expect(mockAxios.get).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/query_multisheet_metadata`,
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
        },
      );
      expect(data).toEqual(undefined);
      expect(error).toEqual(errorObject);
    });
  });
});
