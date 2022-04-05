import { AxiosError } from "axios";
import { getMultisheetMetadata } from "../../src/index";
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
    it("Should Return Multigrid Metadata", async () => {
      // Given
      const response = {
        grids: [
          {
            gridId: testGridTab1Id,
            name: "Test Grid",
            tabName: "Test Grid",
            tabDescription: null,
            pinned: false
          },
          {
            gridId: testGridTab2Id,
            name: "Linked Data Tab",
            tabName: "Linked Data Tab",
            tabDescription: null,
            pinned: false
          }
        ]
      }

      // When
      const { data: responseData, error: responseError } = await getMultisheetMetadata(
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
      const { data: responseData, error: responseError } = await getMultisheetMetadata(
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
      const { data: responseData, error: responseError } = await getMultisheetMetadata(
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
      const { data: responseData, error: responseError } = await getMultisheetMetadata(
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
      const { data: responseData, error: responseError } = await getMultisheetMetadata(
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
