import { AxiosError } from 'axios';
import { getMultisheetMetadata } from '../../src/index';
import {
  bootstrapIntegrationTests,
  cleanupIntegrationTests,
} from './integration.utils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(100000);

let TEST_GRID_ID: string;
let LINKED_DATA_TAB_GRID_ID: string;

const beforeEachRun = async () => {
  jest.resetModules();
  const { testGridId, linkedDataTabGridId } = await bootstrapIntegrationTests();
  TEST_GRID_ID = testGridId;
  LINKED_DATA_TAB_GRID_ID = linkedDataTabGridId;
};

const afterEachRun = async () => {
  await cleanupIntegrationTests(TEST_GRID_ID);
};

describe('Get Multisheet Metadata', () => {
  beforeEach(() => beforeEachRun());
  afterEach(() => afterEachRun());
  describe('Positive Test Cases', () => {
    it('Should Return Multigrid Metadata Successfully', async () => {
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
      const { data, error } = await getMultisheetMetadata(TEST_GRID_ID);

      // Then
      expect(error).toEqual(undefined);
      expect(data).toMatchObject(response);
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
      const { data, error } = await getMultisheetMetadata('INVALID_GRID_ID');

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid View Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'share Id invalid',
        otherDetails: {},
        errorType: 'DATAERROR',
        recoverable: true,
      };

      // When
      const { data, error } = await getMultisheetMetadata(TEST_GRID_ID, {
        shareId: 'INVALID_VIEW_ID',
      });

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id in Production', async () => {
      // Given
      const errorObject = {
        errorMessage: 'You are not authorized to this grid.',
        otherDetails: {},
        errorType: 'DATAERROR',
        recoverable: true,
      };

      // When
      const { data, error } = await getMultisheetMetadata(TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
      });

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id in QA', async () => {
      // Given
      const errorObject = {
        errorMessage: 'System error. Please contact admin.',
        otherDetails: {},
        errorType: 'SYSTEMERROR',
        recoverable: false,
      };

      // When
      const { data, error } = await getMultisheetMetadata(TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
        qa: true,
      });

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
  });
});
