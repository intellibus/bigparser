import { AxiosError } from 'axios';
import { updateByQuery, QueryUpdateObject } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';
import { createGrids, removeGrid } from './integrationTestUtils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

let testGridTab1Id: string;

const queryUpdateObject: QueryUpdateObject<TestGrid> = {
  query: {
    globalFilter: {
      filters: [
        {
          operator: 'LIKE',
          keyword: 'Example',
        },
      ],
    },
  },
  update: {
    columns: {
      'Number Column': 1000,
    },
  },
};

const beforeEachWrapper = async () => {
  jest.resetModules();
  [testGridTab1Id] = await createGrids();
};

describe('Update By Query', () => {
  beforeEach(() => beforeEachWrapper());
  afterEach(() => removeGrid(testGridTab1Id));
  describe('Positive Test Cases', () => {
    it('Should Update Successfully', async () => {
      // Given
      const response = {
        noOfRowsUpdated: 2,
      };

      // When
      const { data: responseData, error: responseError } =
        await updateByQuery<TestGrid>(queryUpdateObject, testGridTab1Id);

      // Then
      expect(responseError).toEqual(undefined);
      expect(responseData).toEqual(response);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'System error. Please contact admin.',
        otherDetails: {},
        errorType: 'SYSTEMERROR',
        recoverable: false,
      };

      // When
      const { data: responseData, error: responseError } =
        await updateByQuery<TestGrid>(queryUpdateObject, 'INVALID_GRID_ID');

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid View Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'System error. Please contact admin.',
        otherDetails: {},
        errorType: 'SYSTEMERROR',
        recoverable: false,
      };

      // When
      const { data: responseData, error: responseError } =
        await updateByQuery<TestGrid>(queryUpdateObject, testGridTab1Id, {
          shareId: 'INVALID_VIEW_ID',
        });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id (prod)', async () => {
      // Given
      const errorObject = {
        errorMessage: 'You are not authorized to this grid.',
        otherDetails: {},
        errorType: 'DATAERROR',
        recoverable: true,
      };

      // When
      const { data: responseData, error: responseError } =
        await updateByQuery<TestGrid>(queryUpdateObject, testGridTab1Id, {
          authId: 'INVALID_AUTHID',
        });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id (qa)', async () => {
      // Given
      const errorObject = {
        errorMessage: 'System error. Please contact admin.',
        otherDetails: {},
        errorType: 'SYSTEMERROR',
        recoverable: false,
      };

      // When
      const { data: responseData, error: responseError } =
        await updateByQuery<TestGrid>(queryUpdateObject, testGridTab1Id, {
          authId: 'INVALID_AUTHID',
          qa: true,
        });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
  });
});
