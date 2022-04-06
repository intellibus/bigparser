import mockAxios from 'jest-mock-axios';
import { getHeaders } from '../../src/index';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';

describe('Get Headers', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe('Positive Test Cases', () => {
    it('Returns Metadata of Grid Columns', async () => {
      // Given
      const gridResponse = {
        name: 'Test Grid.grid',
        description: null,
        columns: [
          {
            columnName: 'String Column',
            columnDesc: '',
            dataType: 'String',
            columnIndex: '0',
            isLinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: 'Number Column',
            columnDesc: '',
            dataType: 'Number',
            columnIndex: '1',
            isLinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: 'Number 2 Column',
            columnDesc: '',
            dataType: 'Number',
            columnIndex: '2',
            isLinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: 'Boolean Column',
            columnDesc: '',
            dataType: 'Boolean',
            columnIndex: '3',
            isLinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: 'Date Column',
            columnDesc: '',
            dataType: 'DATE',
            columnIndex: '4',
            isLinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: 'Date Time Column',
            columnDesc: '',
            dataType: 'DATE_TIME',
            columnIndex: '5',
            isLinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: 'Linked Column',
            columnDesc: '',
            dataType: 'STRING',
            columnIndex: '6',
            isLinkedColumn: true,
            isPrimaryLink: true,
            linkedColumnInfo: {
              sourceGridId: '6244901dc9d0823617041966',
              destinationGridId: '62448f82c9d0822ec669f83b',
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
            columnIndex: '7',
            isLinkedColumn: true,
            isPrimaryLink: false,
            srcColName: 'Linked Related Column',
          },
          {
            columnName: 'Formula Column',
            columnDesc: '',
            dataType: 'STRING',
            columnIndex: '8',
            columnDataSource: {
              functionType: 'SUM',
              columnNames: ['Number Column', 'Number 2 Column'],
            },
            isLinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: 'Empty Column',
            columnDesc: '',
            dataType: 'String',
            columnIndex: '9',
            isLinkedColumn: false,
            isPrimaryLink: false,
          },
        ],
        sort: {},
        sortByIndex: {},
        sortArray: [],
        sortByIndexArray: [],
        fileId: '62448f7ec9d0822ec669f834',
        fileExtension: 'csv',
        fileSource: null,
        imageInfo: null,
        gridType: 'USER',
        defaultSyncPref: null,
        saveType: null,
        lastExtSrcSyncDateTime: null,
        auditGridId: '62448f82c9d0822ec669f83a',
        originalGridId: null,
        lastUpdatedTimeInBigParser: 1648661234129,
        lastUpdatedBy: 'Jonathan Keegan',
        defaultSaveFilter: null,
        filters: {
          isRecent: true,
          isFavorite: null,
          lastVisitedDateTime: 1648661217889,
          lastFavoriteDateTime: null,
          deletedDateTime: null,
          deletedBy: null,
        },
        tabDescription: null,
        tabName: 'Test Tab',
        showRowId: false,
        owner: true,
        multisheet: true,
        auditGrid: false,
      };

      // When
      const getHeadersPromise = getHeaders(TEST_GRID_ID);
      mockAxios.mockResponse({ data: gridResponse });
      const { data, error } = await getHeadersPromise;

      // Then
      expect(mockAxios.get).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/query_metadata`,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(error).toEqual(undefined);
      expect(data).toEqual(gridResponse);
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
      const getHeadersPromise = getHeaders(TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
      });
      mockAxios.mockError(errorObject);
      const { data, error } = await getHeadersPromise;

      // Then
      expect(mockAxios.get).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/query_metadata`,
        {
          headers: {
            authId: 'INVALID_AUTHID',
          },
        }
      );
      expect(data).toEqual(undefined);
      expect(error).toEqual(errorObject);
    });
  });
});
