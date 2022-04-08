import { AxiosError } from 'axios';
import { updateTab } from '../../src/index';
import { UpdateTabObject } from '../../src/types';
import {
  bootstrapIntegrationTests,
  cleanupIntegrationTests,
} from './integration.utils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

let TEST_GRID_ID: string;

const updateTabObject: UpdateTabObject = {
  tabName: 'Updated Name',
};

const beforeEachRun = async () => {
  jest.resetModules();
  const { testGridId } = await bootstrapIntegrationTests();
  TEST_GRID_ID = testGridId;
};

const afterEachRun = async () => {
  await cleanupIntegrationTests(TEST_GRID_ID);
};

describe('Update Tab', () => {
  beforeEach(() => beforeEachRun());
  afterEach(() => afterEachRun());
  describe('Positive Test Cases', () => {
    it('Should Update Tab Successfully', async () => {
      // When
      const { data, error } = await updateTab(updateTabObject, TEST_GRID_ID);

      // Then
      expect(error).toEqual(undefined);
      expect(data).toEqual('');
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
      const { data, error } = await updateTab(
        updateTabObject,
        'INVALID_GRID_ID',
      );

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Share Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'System error. Please contact admin.',
        otherDetails: {},
        errorType: 'SYSTEMERROR',
        recoverable: false,
      };

      // When
      const { data, error } = await updateTab(updateTabObject, TEST_GRID_ID, {
        shareId: 'INVALID_SHARE_ID',
      });

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id in Production', async () => {
      // Given
      const errorObject = {
        errorMessage: 'System error. Please contact admin.',
        otherDetails: {},
        errorType: 'SYSTEMERROR',
        recoverable: false,
      };

      // When
      const { data, error } = await updateTab(updateTabObject, TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
      });

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id in QA', async () => {
      // Given
      const errorObject = {
        errorMessage: 'Grid not found',
        otherDetails: {},
        errorType: 'DATAERROR',
        recoverable: true,
      };

      // When
      const { data, error } = await updateTab(updateTabObject, TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
        qa: true,
      });

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
  });
});
