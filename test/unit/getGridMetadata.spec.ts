import mockAxios from 'jest-mock-axios';
import { getGridMetadata } from '../../src/index';

const { BP_AUTH } = process.env;
const TEST_GRID_ID = 'VALID_GRID_ID';
const LINKED_DATA_TAB_GRID_ID = 'VALID_GRID_ID_2';

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
      const response = {
        name: "Testing Grid.grid",
        description: null,
        columns: [
          {
            columnName: "String Column",
            columnDesc: "",
            dataType: "STRING",
            columnIndex: "5",
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: "Number Column",
            columnDesc: "",
            dataType: "NUMBER",
            columnIndex: "6",
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: "Number 2 Column",
            columnDesc: "",
            dataType: "NUMBER",
            columnIndex: "7",
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: "Boolean Column",
            columnDesc: "",
            dataType: "BOOLEAN",
            columnIndex: "8",
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: "Date Column",
            columnDesc: "",
            dataType: "DATE",
            columnIndex: "9",
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: "Date Time Column",
            columnDesc: "",
            dataType: "DATE_TIME",
            columnIndex: "10",
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: "Linked Column",
            columnDesc: "",
            dataType: "STRING",
            columnIndex: "11",
            islinkedColumn: true,
            isPrimaryLink: true,
            linkedColumnInfo: {
              sourceGridId: LINKED_DATA_TAB_GRID_ID,
              destinationGridId: TEST_GRID_ID,
              sourceColumnName: "Source Column",
              destinationColumnName: "Linked Column",
              queryInSourceGrid: null,
              linkedRelatedColumns: [
                {
                  destColName: "Linked Related Column From Other Grid",
                  srcColName: "Linked Related Column",
                },
              ],
            },
          },
          {
            columnName: "Linked Related Column From Other Grid",
            columnDesc: "",
            dataType: "STRING",
            columnIndex: "12",
            islinkedColumn: true,
            isPrimaryLink: false,
            srcColName: "Linked Related Column",
          },
          {
            columnName: "Formula Column",
            columnDesc: "",
            dataType: "NUMBER",
            columnIndex: "13",
            columnDataSource: {
              functionType: "SUM",
              columnNames: ["Number Column", "Number 2 Column"],
            },
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: "Empty Column",
            columnDesc: "",
            dataType: "STRING",
            columnIndex: "14",
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
        gridType: "USER",
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
        tabName: "Test Tab",
        showRowId: false,
        owner: true,
        multisheet: true,
        auditGrid: false,
      };

      // When
      const getGridMetadataPromise = getGridMetadata(TEST_GRID_ID);
      mockAxios.mockResponse({ data: response });
      const { data, error } = await getGridMetadataPromise;

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
      const getGridMetadataPromise = getGridMetadata(TEST_GRID_ID, {
        authId: 'INVALID_AUTHID',
      });
      mockAxios.mockError(errorObject);
      const { data, error } = await getGridMetadataPromise;

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
