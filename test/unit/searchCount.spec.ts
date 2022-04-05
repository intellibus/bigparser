import mockAxios from "jest-mock-axios";
import { searchCount } from "../../src/index";
import { TestGrid } from "../__grids__/TestGrid";

const { TEST_GRID_ID, BP_AUTH } = process.env;
const queryObject = {
  query: {},
};

describe("Search Count", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe("Positive Test Cases", () => {
    it("Axios Returns Successfully", async () => {
      // Given
      const gridResponse = { totalRowCount: 1 };

      // When
      const searchPromise = searchCount<TestGrid>(queryObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data: responseData, error: responseError } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search_count`,
        queryObject,
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
      const searchPromise = searchCount<TestGrid>(queryObject, TEST_GRID_ID, {
        authId: "INVALID_AUTHID",
      });
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } = await searchPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/search_count`,
        queryObject,
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
