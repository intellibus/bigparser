import mockAxios from "jest-mock-axios";
import { searchDistinct, QueryDistinctObject } from "../../src/index";
import { TestGrid } from "../__grids__/TestGrid";

const { TEST_GRID_ID, BP_AUTH } = process.env;
const queryDistinctObject: QueryDistinctObject<TestGrid> = {
  query: {
    columnFilter: {
      filters: [
        {
          column: "String Column",
          operator: "LIKE",
          keyword: "Example",
        },
      ],
    },
  },
  distinct: {
    columnNames: ["String Column"],
  },
};

describe("Search Distinct", () => {
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
        matchingValues: ["Example String"],
      };

      // When
      const searchDistinctPromise = searchDistinct<TestGrid>(
        queryDistinctObject,
        TEST_GRID_ID
      );
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data: responseData, error: responseError } =
        await searchDistinctPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/distinct`,
        queryDistinctObject,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(responseData).toEqual(gridResponse);
      expect(responseError).toEqual(undefined);
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
      const searchDistinctPromise = searchDistinct<TestGrid>(
        queryDistinctObject,
        TEST_GRID_ID,
        { authId: "INVALID_AUTHID" }
      );
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } =
        await searchDistinctPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/distinct`,
        queryDistinctObject,
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
