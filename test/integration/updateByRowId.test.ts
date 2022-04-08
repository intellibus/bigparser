import { AxiosError } from 'axios';
import { updateByRowId } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';
import { UpdateRowIdObject } from '../../src/types';
import {
  bootstrapIntegrationTests,
  cleanupIntegrationTests,
} from './integration.utils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

let TEST_GRID_ID: string;
let FIRST_ROW_ID: string;

const updateRowIdObject: UpdateRowIdObject<TestGrid> = {
  update: {
    rows: [
      {
        rowId: FIRST_ROW_ID,
        columns: {
          'Boolean Column': false,
        },
      },
    ],
  },
};

const beforeEachRun = async () => {
  jest.resetModules();
  const { testGridId, firstRowId } = await bootstrapIntegrationTests();
  TEST_GRID_ID = testGridId;
  FIRST_ROW_ID = firstRowId;
  updateRowIdObject.update.rows[0].rowId = FIRST_ROW_ID;
};

const afterEachRun = async () => {
  await cleanupIntegrationTests(TEST_GRID_ID);
};

describe('Update By Row Id', () => {
  beforeEach(() => beforeEachRun());
  afterEach(() => afterEachRun());
  describe('Positive Test Cases', () => {
    it('Should Update Successfully', async () => {
      // Given
      const response = {
        noOfRowsUpdated: 1,
        noOfRowsFailed: 0,
        updatedRows: [FIRST_ROW_ID],
        failedRows: {},
      };

      // When
      const { data, error } = await updateByRowId<TestGrid>(
        updateRowIdObject,
        TEST_GRID_ID,
      );

      // Then
      expect(error).toEqual(undefined);
      expect(data).toEqual(response);
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
      const { data, error } = await updateByRowId<TestGrid>(
        updateRowIdObject,
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
      const { data, error } = await updateByRowId<TestGrid>(
        updateRowIdObject,
        TEST_GRID_ID,
        {
          shareId: 'INVALID_SHARE_ID',
        },
      );

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
      const { data, error } = await updateByRowId<TestGrid>(
        updateRowIdObject,
        TEST_GRID_ID,
        {
          authId: 'INVALID_AUTHID',
        },
      );

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
      const { data, error } = await updateByRowId<TestGrid>(
        updateRowIdObject,
        TEST_GRID_ID,
        {
          authId: 'INVALID_AUTHID',
          qa: true,
        },
      );

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
  });
});
