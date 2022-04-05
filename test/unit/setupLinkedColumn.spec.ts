import mockAxios from "jest-mock-axios";
import { setupLinkedColumn, SetupLinkedColumnObject } from "../../src/index";
import { TestGrid, TestGrid2 } from "../__grids__/TestGrid";

const { TEST_GRID_ID, TEST_GRID_ID_2, BP_AUTH } = process.env;
const setupLinkedColumnObject: SetupLinkedColumnObject<TestGrid, TestGrid2> = {
  destinationColumnName: "Linked Column",
  destinationGridId: TEST_GRID_ID,
  linkedRelatedColumns: [
    {
      destColName: "Linked Related Column From Other Grid",
      srcColName: "Linked Related Column",
    },
  ],
  sourceColumnName: "Source Column",
  sourceGridId: TEST_GRID_ID_2,
};

describe("Set Up Linked Column", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe("Positive Test Cases", () => {
    it("Axios Returns Successfully", async () => {
      // Given
      const gridResponse = {};

      // When
      const setupLinkedColumnPromise = setupLinkedColumn<TestGrid, TestGrid2>(
        setupLinkedColumnObject
      );
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data: responseData, error: responseError } =
        await setupLinkedColumnPromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/setup_linked_column`,
        setupLinkedColumnObject,
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
      const setupLinkedColumnPromise = setupLinkedColumn<TestGrid, TestGrid2>(
        setupLinkedColumnObject,
        {
          authId: "INVALID_AUTHID",
        }
      );
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } =
        await setupLinkedColumnPromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/setup_linked_column`,
        setupLinkedColumnObject,
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
