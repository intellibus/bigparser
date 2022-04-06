import mockAxios from 'jest-mock-axios';
import { deleteTab } from '../../src/index';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';

describe('Delete Tab', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Metadata of Tab Deleted', async () => {
      // When
      const deleteTabPromise = deleteTab(TEST_GRID_ID);
      mockAxios.mockResponse({
        data: {},
      });
      const { data, error } = await deleteTabPromise;

      // Then
      expect(mockAxios.delete).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/delete_tab`,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(error).toEqual(undefined);
      expect(data).toEqual({});
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
      const deleteTabPromise = deleteTab(TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
      });
      mockAxios.mockError(errorObject);
      const { data, error } = await deleteTabPromise;

      // Then
      expect(mockAxios.delete).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/delete_tab`,
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
