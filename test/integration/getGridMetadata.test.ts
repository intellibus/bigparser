import { AxiosError } from 'axios';
import { getGridMetadata } from '../../src/index';
import {
  bootstrapIntegrationTests,
  cleanupIntegrationTests,
} from './integration.utils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

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

describe('Get Grid Metadata', () => {
  beforeEach(() => beforeEachRun());
  afterEach(() => afterEachRun());
  describe('Positive Test Cases', () => {
    it('Should Return Grid Metadata Successfully', async () => {
      // Given
      const response = {
        name: 'Testing Grid.grid',
        description: null,
        columns: [
          {
            columnName: 'String Column',
            columnDesc: '',
            dataType: 'STRING',
            columnIndex: '5',
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: 'Number Column',
            columnDesc: '',
            dataType: 'NUMBER',
            columnIndex: '6',
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: 'Number 2 Column',
            columnDesc: '',
            dataType: 'NUMBER',
            columnIndex: '7',
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: 'Boolean Column',
            columnDesc: '',
            dataType: 'BOOLEAN',
            columnIndex: '8',
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: 'Date Column',
            columnDesc: '',
            dataType: 'DATE',
            columnIndex: '9',
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: 'Date Time Column',
            columnDesc: '',
            dataType: 'DATE_TIME',
            columnIndex: '10',
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: 'Linked Column',
            columnDesc: '',
            dataType: 'STRING',
            columnIndex: '11',
            islinkedColumn: true,
            isPrimaryLink: true,
            linkedColumnInfo: {
              sourceGridId: LINKED_DATA_TAB_GRID_ID,
              destinationGridId: TEST_GRID_ID,
              sourceColumnName: 'Source Column',
              destinationColumnName: 'Linked Column',
              queryInSourceGrid: null,
              linkedRelatedColumns: [
                {
                  destColName: 'Linked Related Column From Other Grid',
                  srcColName: 'Linked Related Column',
                },
              ],
            },
          },
          {
            columnName: 'Linked Related Column From Other Grid',
            columnDesc: '',
            dataType: 'STRING',
            columnIndex: '12',
            islinkedColumn: true,
            isPrimaryLink: false,
            srcColName: 'Linked Related Column',
          },
          {
            columnName: 'Formula Column',
            columnDesc: '',
            dataType: 'NUMBER',
            columnIndex: '13',
            columnDataSource: {
              functionType: 'SUM',
              columnNames: ['Number Column', 'Number 2 Column'],
            },
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: 'Empty Column',
            columnDesc: '',
            dataType: 'STRING',
            columnIndex: '14',
            islinkedColumn: false,
            isPrimaryLink: false,
          },
        ],
        sort: {},
        sortByIndex: {},
        sortArray: [],
        sortByIndexArray: [],
        // Also contains fileId
        fileExtension: null,
        fileSource: null,
        imageInfo: null,
        gridType: 'USER',
        defaultSyncPref: null,
        saveType: null,
        lastExtSrcSyncDateTime: null,
        auditGridId: null,
        originalGridId: null,
        // Also contains lastUpdatedTimeInBigParser
        // Also contains lastUpdatedBy
        defaultSaveFilter: null,
        filters: null,
        tabDescription: null,
        tabName: 'Test Tab',
        showRowId: false,
        owner: true,
        multisheet: true,
        auditGrid: false,
      };

      // When
      const { data, error } = await getGridMetadata(TEST_GRID_ID);

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
      const { data, error } = await getGridMetadata('INVALID_GRID_ID');

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Share Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'share Id invalid',
        otherDetails: {},
        errorType: 'DATAERROR',
        recoverable: true,
      };

      // When
      const { data, error } = await getGridMetadata(TEST_GRID_ID, {
        shareId: 'INVALID_SHARE_ID',
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
      const { data, error } = await getGridMetadata(TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
      });

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
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
      const { data, error } = await getGridMetadata(TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
        qa: true,
      });

      // Then
      expect(data).toEqual(undefined);
      expect((error as AxiosError).response.data).toEqual(errorObject);
    });
  });
});
