import { AxiosError } from 'axios';
import { searchDistinct, QueryDistinctObject } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';
import { createGrids, removeGrid } from './integrationTestUtils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

let testGridTab1Id: string;

const queryDistinctObject: QueryDistinctObject<TestGrid> = {
  query: {},
  distinct: {
    columnNames: ['String Column'],
  },
};

const beforeEachWrapper = async () => {
  jest.resetModules();
  [testGridTab1Id] = await createGrids();
};

describe('Search Distinct', () => {
  beforeEach(() => beforeEachWrapper());
  afterEach(() => removeGrid(testGridTab1Id));
  describe('Positive Test Cases', () => {
    it('Should Return Distinct Values from Grid Results', async () => {
      // Given
      const response = {
        matchingValues: ['Example String'],
      };

      // When
      const { data: responseData, error: responseError } =
        await searchDistinct<TestGrid>(queryDistinctObject, testGridTab1Id);

      // Then
      expect(responseData).toEqual(response);
      expect(responseError).toEqual(undefined);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'Grid not found',
        otherDetails: {},
        errorType: 'DATAERROR',
        recoverable: true,
      };

      // When
      const { data: responseData, error: responseError } =
        await searchDistinct<TestGrid>(queryDistinctObject, 'INVALID_GRID_ID');

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'authId is invalid',
        otherDetails: {},
        errorType: 'AUTHERROR',
        recoverable: true,
      };

      // When
      const { data: responseData, error: responseError } =
        await searchDistinct<TestGrid>(queryDistinctObject, testGridTab1Id, {
          authId: 'INVALID_AUTHID',
        });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
  });
});
