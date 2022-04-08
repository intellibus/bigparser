import mockAxios from 'jest-mock-axios';
import { createTab, CreateTabObject } from '../../src/index';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const createTabObject: CreateTabObject = {
  tabName: 'New Tab',
  tabDescription: 'foobar',
};

describe('Create Tab', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Grid Id of Tab Created', async () => {
      // Given
      const response = {
        gridId: '624c67b1c9d0823617062b01',
      };

      // When
      const createTabPromise = createTab(createTabObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await createTabPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/create_tab`,
        createTabObject,
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
      const createTabPromise = createTab(createTabObject, TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
      });
      mockAxios.mockError(errorObject);
      const { data, error } = await createTabPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/create_tab`,
        createTabObject,
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
