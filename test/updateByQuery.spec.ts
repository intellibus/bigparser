/*
  Grid should update values in all columns (Filter Status?) that matches keyword "Example" 
 */

import { updateByQuery } from "../src/index";

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

describe("Update Grid by Query", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  describe("Positive Test Cases", () => {
    it("Should Return No of Rows Updated by the Query", async () => {
      // Given
      const { TEST_GRID_ID } = process.env;

      const gridData = {
        noOfRowsUpdated: 2,
      };

      // When
      const { data: searchData, error: searchError } =
        await updateByQuery<TestGridModel>(
          {
            update: {
              columns: {
                "Date Column": "Found global filter",
              },
            },
            query: {
              globalFilter: {
                filters: [
                  {
                    operator: "LIKE",
                    keyword: "Example",
                  },
                ],
              },
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
    it("Should Throw Error when the Column doesn't exist to update", async () => {
      const { TEST_GRID_ID } = process.env;

      const gridData = {
        errorMessage: "[Date Column]invalid columns name or their data type",
        otherDetails: {},
        errorType: "DATAERROR",
        recoverable: true,
      };

      // When
      const { data: searchData, error: searchError } =
        await updateByQuery<TestGridModel>(
          {
            update: {
              columns: {
                "Date Column": "Found global filter", // ? How to tackle this when we intenionally want to pass a column name that doesnt exist
              },
            },
            query: {
              globalFilter: {
                filters: [
                  {
                    operator: "LIKE",
                    keyword: "Example",
                  },
                ],
              },
            },
          },
          TEST_GRID_ID
        );
      // Then
      expect(searchData).toEqual(gridData);
      expect(searchError).toEqual(null);
    });
    it("Should Reject Invalid Grid Id", async () => {
      // When
      const { data: searchData, error: searchError } =
        await updateByQuery<TestGridModel>(
          {
            update: {
              columns: {},
            },
            query: {
              globalFilter: {
                filters: [
                  {
                    operator: "LIKE",
                    keyword: "Example",
                  },
                ],
              },
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
        await updateByQuery<TestGridModel>(
          { query: {}, update: { columns: {} } },
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
