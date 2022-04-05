import { AxiosError } from "axios";
import { getHeaders } from "../../src/index";
import { createGrids, removeGrid } from "./integrationTestUtils";

jest.disableAutomock();
jest.unmock("axios");
jest.setTimeout(10000);

let testGridTab1Id: string;
let testGridTab2Id: string;

const beforeEachWrapper = async () => {
  jest.resetModules();
  [testGridTab1Id, testGridTab2Id] = await createGrids();
};

describe("Get Headers", () => {
  beforeEach(() => beforeEachWrapper());
  afterEach(() => removeGrid(testGridTab1Id));
  describe("Positive Test Cases", () => {
    it("Should Return Grid Metadata", async () => {
      // Given
      const response = {
        name: "integrationTestGrid.grid",
        description: null,
        columns: [
          {
            columnName: "String Column",
            columnDesc: "",
            dataType: "STRING",
            columnIndex: '5',
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: "Number Column",
            columnDesc: "",
            dataType: "NUMBER",
            columnIndex: '6',
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: "Number 2 Column",
            columnDesc: "",
            dataType: "NUMBER",
            columnIndex: '7',
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: "Boolean Column",
            columnDesc: "",
            dataType: "BOOLEAN",
            columnIndex: '8',
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: "Date Column",
            columnDesc: "",
            dataType: "DATE_TIME",
            columnIndex: '9',
            islinkedColumn: false,
            isPrimaryLink: false,
          },
          {
            columnName: "Linked Column",
            columnDesc: "",
            dataType: "STRING",
            columnIndex: '10',
            islinkedColumn: true,
            isPrimaryLink: true,
            linkedColumnInfo: {
              sourceGridId: testGridTab2Id,
              destinationGridId: testGridTab1Id,
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
            columnIndex: '11',
            islinkedColumn: true,
            isPrimaryLink: false,
            srcColName: "Linked Related Column",
          },
          {
            columnName: "Formula Column",
            columnDesc: "",
            dataType: "NUMBER",
            columnIndex: '12',
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
            columnIndex: '13',
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
        tabName: "Test Grid",
        showRowId: false,
        owner: true,
        multisheet: true,
        auditGrid: false,
      };

      // When
      const { data: responseData, error: responseError } = await getHeaders(
        testGridTab1Id
      );

      // Then
      expect(responseError).toEqual(undefined);
      expect(responseData).toMatchObject(response);
    });
  });
  describe("Negative Test Cases", () => {
    it("Should Reject Invalid Grid Id", async () => {
      // Given
      const errorObject = {
        errorMessage: "System error. Please contact admin.",
        otherDetails: {},
        errorType: "SYSTEMERROR",
        recoverable: false,
      };

      // When
      const { data: responseData, error: responseError } = await getHeaders(
        "INVALID_GRID_ID"
      );

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it("Should Reject Invalid View Id", async () => {
      // Given
      const errorObject = {
        errorMessage: "share Id invalid",
        otherDetails: {},
        errorType: "DATAERROR",
        recoverable: true,
      };

      // When
      const { data: responseData, error: responseError } = await getHeaders(
        testGridTab1Id,
        {
          viewId: "INVALID_VIEW_ID",
        }
      );
      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it("Should Reject Invalid Auth Id (prod)", async () => {
      // Given
      const errorObject = {
        errorMessage: "authId is invalid",
        otherDetails: {},
        errorType: "AUTHERROR",
        recoverable: true,
      };

      // When
      const { data: responseData, error: responseError } = await getHeaders(
        testGridTab1Id,
        {
          authId: "INVALID_AUTHID",
        }
      );

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it("Should Reject Invalid Auth Id (qa)", async () => {
      // Given
      const errorObject = {
        errorMessage: "authId is invalid",
        otherDetails: {},
        errorType: "AUTHERROR",
        recoverable: true,
      };

      // When
      const { data: responseData, error: responseError } = await getHeaders(
        testGridTab1Id,
        {
          authId: "INVALID_AUTHID",
          qa: true,
        }
      );

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
  });
});
