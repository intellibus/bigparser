import { AxiosError } from "axios";
import { searchCount } from "../../src/index";
import {
  TestGrid
} from "../__grids__/TestGrid";
import { QueryObject } from "../../src/types";
import { createGrids, removeGrid } from "./integrationTestUtils";

jest.disableAutomock();
jest.unmock("axios");
jest.setTimeout(10000);

let testGridTab1Id: string;

const queryObject: QueryObject<TestGrid> = {
  query: {},
};

const beforeEachWrapper = async () => {
  jest.resetModules();
  [testGridTab1Id] = await createGrids();
};

describe("Search Count", () => {
  beforeEach(() => beforeEachWrapper());
  afterEach(() => removeGrid(testGridTab1Id));
  describe("Positive Test Cases", () => {
    it("Should Return Number of Grid Results", async () => {
      // Given
      const response = { totalRowCount: 2 };

      // When
      const { data: responseData, error: responseError } = await searchCount<TestGrid>(queryObject, testGridTab1Id);
      
      // Then
      expect(responseError).toEqual(undefined);
      expect(responseData).toEqual(response);
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
      const { data: responseData, error: responseError } = await searchCount<TestGrid>(queryObject, "INVALID_GRID_ID");
      
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
      const { data: responseData, error: responseError } = await searchCount<TestGrid>(queryObject, testGridTab1Id, {
        viewId: "INVALID_VIEW_ID",
      });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it("Should Reject Invalid Auth Id (prod)", async () => {
      // Given
      const errorObject = {
        errorMessage: "You are not authorized to this grid.",
        otherDetails: {},
        errorType: "DATAERROR",
        recoverable: true,
      };

      // When
      const { data: responseData, error: responseError } = await searchCount<TestGrid>(queryObject, testGridTab1Id, {
        authId: "INVALID_AUTHID",
      });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it("Should Reject Invalid Auth Id (qa)", async () => {
      // Given
      const errorObject = {
        errorMessage: "System error. Please contact admin.",
        otherDetails: {},
        errorType: "SYSTEMERROR",
        recoverable: false,
      };

      // When
      const { data: responseData, error: responseError } = await searchCount<TestGrid>(queryObject, testGridTab1Id, {
        authId: "INVALID_AUTHID",
        qa: true,
      });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
  });
});
