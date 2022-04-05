import mockAxios from "jest-mock-axios";
import { deleteTab } from "../../src/index";

const { BP_AUTH, TEST_GRID_ID } = process.env;

describe("Delete Tab", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    mockAxios.reset();
  });
  describe("Positive Test Cases", () => {
    it("Axios Returns Successfully", async () => {
      // When
      const deleteTabPromise = deleteTab(TEST_GRID_ID);
      mockAxios.mockResponse({
        data: {},
      });
      const { data: responseData, error: responseError } =
        await deleteTabPromise;

      // Then
      expect(mockAxios.delete).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/delete_tab`,
        {
          headers: {
            authId: BP_AUTH,
          },
        }
      );
      expect(responseError).toEqual(undefined);
      expect(responseData).toEqual({});
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
      const deleteTabPromise = deleteTab(TEST_GRID_ID, {
        authId: "INVALID_AUTHID",
      });
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } =
        await deleteTabPromise;

      // Then
      expect(mockAxios.delete).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/delete_tab`,
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
