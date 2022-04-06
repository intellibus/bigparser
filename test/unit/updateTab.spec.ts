import mockAxios from 'jest-mock-axios';
import { updateTab, UpdateTabObject } from '../../src/index';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const updateTabObject: UpdateTabObject = {
  tabName: 'New Tab Name',
  tabDescription: 'foobar',
};

describe('Update Tab', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Grid Id of Updated Tab', async () => {
      // Given
      const gridResponse = {};

      // When
      const updateTabPromise = updateTab(updateTabObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data, error } = await updateTabPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/update_tab`,
        updateTabObject,
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
      const updateTabPromise = updateTab(updateTabObject, TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
      });
      mockAxios.mockError(errorObject);
      const { data, error } = await updateTabPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/update_tab`,
        updateTabObject,
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
