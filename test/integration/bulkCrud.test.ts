import { AxiosError } from 'axios';
import { bulkCrud } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';
import { BulkCrudObject } from '../../src/types';
import {
  bootstrapIntegrationTests,
  cleanupIntegrationTests,
} from './integration.utils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

let TEST_GRID_ID: string;
let FIRST_ROW_ID: string;
let SECOND_ROW_ID: string;

const bulkCrudObject: BulkCrudObject<TestGrid> = {
  insertRows: [
    {
      rows: [
        {
          'String Column': 'Test String',
          'Number Column': 1,
          Age: 2,
          'Boolean Column': true,
          'Date Column': '2022-04-07T21:43:35.575Z',
          'Date Time Column': '2022-04-07T21:43:35.575Z',
          'Linked Column': 'Test String',
          'Linked Related Column From Other Grid': 'Test String',
          'Formula Column': 123,
          'Empty Column': 'Test String',
        },
      ],
      beforeRowId: FIRST_ROW_ID,
    },
  ],
  updateRows: {
    rows: [
      {
        rowId: FIRST_ROW_ID,
        columns: {
          'Date Column': '2022-04-07T21:43:35.575Z',
        },
      },
    ],
  },
  deleteRows: {
    rows: [
      {
        rowId: SECOND_ROW_ID,
      },
    ],
  },
  insertColumns: [
    {
      afterColumn: 'String Column',
      columns: [
        {
          columnName: 'String 2 Column',
        },
        {
          columnName: 'String 3 Column',
        },
      ],
    },
  ],
  deleteColumns: {
    columns: [
      {
        columnName: 'Empty Column',
      },
    ],
  },
  renameColumns: {
    columns: [
      {
        existingColumnName: 'Number 2 Column',
        newColumnName: 'Age',
      },
    ],
  },
};

const beforeEachRun = async () => {
  jest.resetModules();
  const { testGridId, firstRowId, secondRowId } =
    await bootstrapIntegrationTests();
  TEST_GRID_ID = testGridId;
  FIRST_ROW_ID = firstRowId;
  SECOND_ROW_ID = secondRowId;
  bulkCrudObject.insertRows[0].beforeRowId = FIRST_ROW_ID;
  bulkCrudObject.updateRows.rows[0].rowId = FIRST_ROW_ID;
  bulkCrudObject.deleteRows.rows[0].rowId = SECOND_ROW_ID;
};

const afterEachRun = async () => {
  await cleanupIntegrationTests(TEST_GRID_ID);
};

describe('Bulk CRUD', () => {
  beforeEach(() => beforeEachRun());
  afterEach(() => afterEachRun());
  describe('Positive Test Cases', () => {
    it('Should Return Numbers of Successful Bulk Operations', async () => {
      // Given
      const response = {
        insertRows: [
          {
            createdRows: {
              // Contains something like `0: '62506816c9d082361707ea9d'`
            },
            failedRows: {},
            noOfRowsCreated: 1,
            noOfRowsFailed: 0,
          },
        ],
        updateRows: {
          updatedRows: [FIRST_ROW_ID],
          failedRows: {},
          noOfRowsUpdated: 1,
          noOfRowsFailed: 0,
        },
        deleteRows: {
          deletedRows: [SECOND_ROW_ID],
          failedRows: {},
          noOfRowsDeleted: 1,
          noOfRowsFailed: 0,
        },
        insertColumns: [
          {
            noOfColumnsUpdated: 2,
          },
        ],
        deleteColumns: {
          noOfColumnsUpdated: 1,
        },
        renameColumns: {
          noOfColumnsUpdated: 1,
        },
      };

      // When
      const { data, error } = await bulkCrud<TestGrid>(
        bulkCrudObject,
        TEST_GRID_ID,
      );

      // Then
      expect(error).toEqual(undefined);
      expect(data).toMatchObject(response);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'Grid not found.',
        otherDetails: {},
        errorType: 'DATAERROR',
        recoverable: true,
      };

      // When
      const { data, error } = await bulkCrud<TestGrid>(
        bulkCrudObject,
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
      const { data, error } = await bulkCrud<TestGrid>(
        bulkCrudObject,
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
        errorMessage: 'System error. Please contact admin.',
        otherDetails: {},
        errorType: 'SYSTEMERROR',
        recoverable: false,
      };

      // When
      const { data, error } = await bulkCrud<TestGrid>(
        bulkCrudObject,
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
        errorMessage: 'Grid not found.',
        otherDetails: {},
        errorType: 'DATAERROR',
        recoverable: true,
      };

      // When
      const { data, error } = await bulkCrud<TestGrid>(
        bulkCrudObject,
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
