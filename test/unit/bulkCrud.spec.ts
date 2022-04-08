import mockAxios from 'jest-mock-axios';
import { bulkCrud, BulkCrudObject } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const bulkCrudObject: BulkCrudObject<TestGrid> = {
  insertRows: [
    {
      rows: [
        {
          'String Column': 'Test String',
          'Number Column': 1,
          'Number 2 Column': 2,
          'Boolean Column': true,
          'Date Column': '2022-04-07T21:43:35.575Z',
          'Date Time Column': '2022-04-07T21:43:35.575Z',
          'Linked Column': 'Test String',
          'Linked Related Column From Other Grid': 'Test String',
          'Formula Column': 123,
          'Empty Column': 'Test String',
        },
      ],
      beforeRowId: '8f6c2c6594a0303f3df4b098',
    },
  ],
  updateRows: {
    rows: [
      {
        rowId: '5d7a509dc9d08233cebdcc11',
        columns: {
          'Date Column': '2022-04-07T21:43:35.575Z',
        },
      },
    ],
  },
  deleteRows: {
    rows: [
      {
        rowId: '5fcdcfe194a03062b3f7c644',
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

describe('Bulk CRUD', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Number of Successful Bulk Operations', async () => {
      // Given
      const response = {
        insertRows: [
          {
            createdRows: {
              0: '62505000c9d082361707accc',
            },
            failedRows: {},
            noOfRowsCreated: 1,
            noOfRowsFailed: 0,
          },
        ],
        updateRows: {
          updatedRows: ['62505000c9d082361707accc'],
          failedRows: {},
          noOfRowsUpdated: 1,
          noOfRowsFailed: 0,
        },
        deleteRows: {
          deletedRows: ['62505000c9d082361707accd'],
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
      const bulkCrudPromise = bulkCrud<TestGrid>(bulkCrudObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: response,
      });
      const { data, error } = await bulkCrudPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows_columns/bulk_crud`,
        bulkCrudObject,
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
      const bulkCrudPromise = bulkCrud<TestGrid>(bulkCrudObject, TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
      });
      mockAxios.mockError(errorObject);
      const { data, error } = await bulkCrudPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/rows_columns/bulk_crud`,
        bulkCrudObject,
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
