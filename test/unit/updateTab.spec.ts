import mockAxios from "jest-mock-axios";
import { updateTab, UpdateTabObject } from "../../src/index";

const { TEST_GRID_ID, BP_AUTH } = process.env;
const updateTabObject: UpdateTabObject = {
  tabName: "New Tab Name",
  tabDescription: "foobar",
};

describe("Update Tab", () => {
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
      const updateTabPromise = updateTab(updateTabObject, TEST_GRID_ID);
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data: responseData, error: responseError } =
        await updateTabPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/update_tab`,
        updateTabObject,
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
      const updateTabPromise = updateTab(updateTabObject, TEST_GRID_ID, {
        authId: "INVALID_AUTHID",
      });
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } =
        await updateTabPromise;

      // Then
      expect(mockAxios.post).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/update_tab`,
        updateTabObject,
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
