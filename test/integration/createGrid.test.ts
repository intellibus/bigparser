import { AxiosError } from 'axios';
import { createGrid } from '../../src/index';
import { CreateGridObject } from '../../src/types';
import { cleanupIntegrationTests } from './integration.utils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

const createGridObject: CreateGridObject = {
  gridName: 'Testing Grid',
  gridTabs: [
    {
      tabName: 'Test Tab',
    },
  ],
};

describe('Create Grid', () => {
  describe('Positive Test Cases', () => {
    it('Should Create Grid Successfully', async () => {
      // Given
      const response = {
        gridId: 'some_grid_id',
      };

      // When
      const { data, error } = await createGrid(createGridObject);

      // Then
      expect(error).toEqual(undefined);
      expect(Object.keys(data)).toEqual(Object.keys(response));
      await cleanupIntegrationTests(data.gridId);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Auth Id in Production', async () => {
      // Given
      const errorObject = {
        errorMessage: 'System error. Please contact admin.',
        otherDetails: {},
        errorType: 'SYSTEMERROR',
        recoverable: false,
      };

      // When
      const { data, error } = await createGrid(createGridObject, {
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
      const { data, error } = await createGrid(createGridObject, {
        authId: 'INVALID_AUTHID',
        qa: true,
      });

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
  });
});
