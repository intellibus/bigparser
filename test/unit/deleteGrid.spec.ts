import mockAxios from 'jest-mock-axios';
import { deleteGrid } from '../../src/index';

const { BP_AUTH } = process.env;
const TEST_FILE_ID = 'VALID_FILE_ID';

describe('Delete Grid', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Metadata of Tab Deleted', async () => {
      // When
      const deleteTabPromise = deleteGrid(TEST_FILE_ID);
      mockAxios.mockResponse({
        data: {},
      });
      const { data, error } = await deleteTabPromise;

      // Then
      expect(mockAxios.delete).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/file/remove`,
        {
          headers: {
            authId: BP_AUTH,
          },
          data: {
            id: TEST_FILE_ID,
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
      const deleteTabPromise = deleteGrid(TEST_FILE_ID, {
        authId: 'INVALID_AUTHID',
      });
      mockAxios.mockError(errorObject);
      const { data, error } = await deleteTabPromise;

      // Then
      expect(mockAxios.delete).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/file/remove`,
        {
          headers: {
            authId: 'INVALID_AUTHID',
          },
          data: {
            id: TEST_FILE_ID,
          },
        }
      );
      expect(error).toEqual(errorObject);
      expect(data).toEqual(undefined);
    });
  });
});
