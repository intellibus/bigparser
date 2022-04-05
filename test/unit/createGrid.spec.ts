import mockAxios from "jest-mock-axios";
import { createGrid, CreateGridObject } from "../../src/index";

const { BP_AUTH } = process.env;
const createGridObject: CreateGridObject = {
  gridName: "New Grid",
  gridTabs: [
    {
      tabName: "New Tab",
    },
  ],
};

describe("Create Grid", () => {
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
        gridId: "624c8267c9d08236170650a5",
      };

      // When
      const createGridPromise = createGrid(createGridObject);
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data: responseData, error: responseError } =
        await createGridPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        "https://www.bigparser.com/api/v2/grid/create_grid",
        createGridObject,
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
      const createGridPromise = createGrid(createGridObject, {
        authId: "INVALID_AUTHID",
      });
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } =
        await createGridPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        "https://www.bigparser.com/api/v2/grid/create_grid",
        createGridObject,
        {
          headers: {
            authId: "INVALID_AUTHID",
          },
        }
      );
      expect(responseError).toEqual(errorObject);
      expect(responseData).toEqual(undefined);
    });
  });
});
