import mockAxios from "jest-mock-axios";
import { getMultisheetMetadata } from "../../src/index";

const { TEST_GRID_ID, BP_AUTH } = process.env;

describe("Get Multisheet Metadata", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe("Positive Test Cases", () => {
    it("Axios Returns Successfully", async () => {
      // Given
      const gridResponse = {
        grids: [
          {
            gridId: "62448f82c9d0822ec669f83b",
            name: "Test Tab",
            tabName: "Test Tab",
            tabDescription: null,
            pinned: false,
          },
          {
            gridId: "6244901dc9d0823617041966",
            name: "Linked Data Tab",
            tabName: "Linked Data Tab",
            tabDescription: null,
            pinned: false,
          },
        ],
      };

      // When
      const getMultisheetMetadataPromise = getMultisheetMetadata(TEST_GRID_ID);
      mockAxios.mockResponse({ data: gridResponse });
      const { data: responseData, error: responseError } =
        await getMultisheetMetadataPromise;

      // Then
      expect(mockAxios.get).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/query_multisheet_metadata`,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(responseError).toEqual(undefined);
      expect(responseData).toEqual(gridResponse);
    });
  });
  describe("Negative Test Cases", () => {
    it("Axios Returns Error", async () => {
      // Given
      const errorObject = {
        err: {
          message: "Invalid Auth Id",
          statusCode: 403,
        },
      };

      // When
      const getMultisheetMetadataPromise = getMultisheetMetadata(TEST_GRID_ID, {
        authId: "INVALID_AUTHID",
      });
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } =
        await getMultisheetMetadataPromise;

      // Then
      expect(mockAxios.get).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/query_multisheet_metadata`,
        {
          headers: {
            authId: "INVALID_AUTHID",
          },
        }
      );
      expect(responseData).toEqual(undefined);
      expect(responseError).toEqual(errorObject);
    });
  });
});
