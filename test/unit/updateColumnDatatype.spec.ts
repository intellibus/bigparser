import mockAxios from "jest-mock-axios";
import {
  updateColumnDatatype,
  UpdateColumnDatatypeObject,
} from "../../src/index";
import { TestGrid } from "../__grids__/TestGrid";

const { TEST_GRID_ID, BP_AUTH } = process.env;
const updateColumnDatatypeObject: UpdateColumnDatatypeObject<TestGrid> = {
  columns: [
    {
      columnName: "Empty Column",
      dataType: "NUMBER",
    },
  ],
};

describe("Update Column Datatype", () => {
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
        dataFixId: "6245fd56c9d082361704bdd3",
        message:
          "Please use 'fix_data_type_of_existing_data/status'" +
          " api to check the status.",
      };

      // When
      const updateColumnDatatypePromise = updateColumnDatatype<TestGrid>(
        updateColumnDatatypeObject,
        TEST_GRID_ID
      );
      mockAxios.mockResponse({
        data: gridResponse,
      });
      const { data: responseData, error: responseError } =
        await updateColumnDatatypePromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/update_column_datatype`,
        updateColumnDatatypeObject,
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
      const updateColumnDatatypePromise = updateColumnDatatype<TestGrid>(
        updateColumnDatatypeObject,
        TEST_GRID_ID,
        { authId: "INVALID_AUTHID" }
      );
      mockAxios.mockError(errorObject);
      const { data: responseData, error: responseError } =
        await updateColumnDatatypePromise;

      // Then
      expect(mockAxios.put).toHaveBeenCalledWith(
        `https://www.bigparser.com/api/v2/grid/${TEST_GRID_ID}/update_column_datatype`,
        updateColumnDatatypeObject,
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
