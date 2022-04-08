import { AxiosError } from 'axios';
import { createTab } from '../../src/index';
import { CreateTabObject } from '../../src/types';
import {
  bootstrapIntegrationTests,
  cleanupIntegrationTests,
} from './integration.utils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

let TEST_GRID_ID: string;

const createTabObject: CreateTabObject = {
  tabName: 'Linked Data Tab',
};

const beforeEachRun = async () => {
  jest.resetModules();
  const { testGridId } = await bootstrapIntegrationTests();
  TEST_GRID_ID = testGridId;
};

const afterEachRun = async () => {
  await cleanupIntegrationTests(TEST_GRID_ID);
};

describe('Create Tab', () => {
  beforeEach(() => beforeEachRun());
  afterEach(() => afterEachRun());
  describe('Positive Test Cases', () => {
    it('Should Create Tab Successfully', async () => {
      // Given
      const response = {
        gridId: 'some_grid_id',
      };

      // When
      const { data, error } = await createTab(createTabObject, TEST_GRID_ID);

      // Then
      expect(error).toEqual(undefined);
      expect(Object.keys(data)).toEqual(Object.keys(response));
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
      const { data, error } = await createTab(
        createTabObject,
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
      const { data, error } = await createTab(createTabObject, TEST_GRID_ID, {
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
      const { data, error } = await createTab(createTabObject, TEST_GRID_ID, {
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
      const { data, error } = await createTab(createTabObject, TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
        qa: true,
      });

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
  });
});
