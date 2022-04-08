import { AxiosError } from 'axios';
import { deleteGrid, getGridMetadata } from '../../src/index';
import {
  bootstrapIntegrationTests,
  cleanupIntegrationTests,
} from './integration.utils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

let TEST_GRID_ID: string;

const beforeEachRun = async () => {
  jest.resetModules();
  const { testGridId } = await bootstrapIntegrationTests();
  TEST_GRID_ID = testGridId;
};

describe('Delete Grid', () => {
  beforeEach(() => beforeEachRun());
  describe('Positive Test Cases', () => {
    it('Should Delete Grid Successfully', async () => {
      // When
      const {
        data: { fileId },
      } = await getGridMetadata(TEST_GRID_ID);
      const { data, error } = await deleteGrid(fileId);

      // Then
      expect(error).toEqual(undefined);
      expect(data).toEqual('');
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid File Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'fileId is invalid Please contact admin.',
        errorType: 'SYSTEMERROR',
      };

      // When
      const { data, error } = await deleteGrid('INVALID_FILE_ID');

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
      await cleanupIntegrationTests(TEST_GRID_ID);
    });
    it('Should Reject Invalid Auth Id in Production', async () => {
      // Given
      const errorObject = {
        errorMessage: 'Empty or invalid authId found in header',
        errorType: 'AUTHERROR',
        recoverable: true,
      };

      // When
      const {
        data: { fileId },
      } = await getGridMetadata(TEST_GRID_ID);
      const { data, error } = await deleteGrid(fileId, {
        authId: 'INVALID_AUTHID',
      });

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
      await cleanupIntegrationTests(TEST_GRID_ID);
    });
    it('Should Reject Invalid Auth Id in QA', async () => {
      // Given
      const errorObject = {
        errorMessage: 'Empty or invalid authId found in header',
        errorType: 'AUTHERROR',
        recoverable: true,
      };

      // When
      const {
        data: { fileId },
      } = await getGridMetadata(TEST_GRID_ID);
      const { data, error } = await deleteGrid(fileId, {
        authId: 'INVALID_AUTHID',
        qa: true,
      });

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
      await cleanupIntegrationTests(TEST_GRID_ID);
    });
  });
});
