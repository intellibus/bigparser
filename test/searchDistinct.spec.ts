/*
  Grid should have two values in "String Column": "Example 1", "Example 2" to match keyword "Example" to return distinct values
 */

import { searchDistinct } from "../src/index";

interface TestGridModel {
  _id: string;
  "String Column": string;
  "Number Column": number;
  "Number 2 Column": number;
  "Boolean Column": boolean;
  "Date Column": string;
  "Linked Column": string;
  "Linked Related Column From Other Grid": string;
  "Formula Column": number;
}

describe("Search Distinct", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  describe("Positive Test Cases", () => {
    it("Should Return Matching Distinct Values from Grid Data", async () => {
      // Given
      const { TEST_GRID_ID } = process.env;

      const gridData = {
        matchingValues: ["Example String 2", "Example String"],
      };

      // When
      const { data: searchData, error: searchError } =
        await searchDistinct<TestGridModel>(
          {
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
          },
          TEST_GRID_ID
        );
      // Then
      expect(searchData).toEqual(gridData);
      expect(searchError).toEqual(null);
    });
  });
  describe("Negative Test Cases", () => {
    it("Should Reject Invalid Grid Id", async () => {
      // When
      const { data: searchData, error: searchError } =
        await searchDistinct<TestGridModel>(
          {
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
          },
          ""
        );
      // Then
      expect(searchData).toEqual(null);
      expect(searchError).toBeTruthy();
    });
    it("Should Reject Invalid Auth Id", async () => {
      // Given
      const { TEST_GRID_ID } = process.env;
      // When
      const { data: searchData, error: searchError } =
        await searchDistinct<TestGridModel>(
          { query: {}, distinct: {} },
          TEST_GRID_ID,
          "",
          "INVALID_AUTH_ID"
        );
      // Then
      expect(searchData).toEqual(null);
      expect(searchError).toBeTruthy();
    });
  });
});
