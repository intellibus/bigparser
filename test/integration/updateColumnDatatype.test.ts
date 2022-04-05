import { AxiosError } from 'axios';
import {
  updateColumnDatatype
} from '../../src/index';
import {
  TestGrid
} from '../__grids__/TestGrid';
import {
  UpdateColumnDatatypeObject
} from '../../src/types'
import { createGrids, removeGrid } from './integrationTestUtils';

jest.disableAutomock();
jest.unmock('axios');
jest.setTimeout(10000);

let testGridTab1Id: string;

const updateColumnDatatypeObject: UpdateColumnDatatypeObject<TestGrid> = {
  columns: [
    {
      columnName: 'Empty Column',
      dataType: 'NUMBER',
    },
  ],
};

const beforeEachWrapper = async () => {
  jest.resetModules();
  [testGridTab1Id] = await createGrids();
}

describe('Update Column Datatype', () => {
  beforeEach(() => beforeEachWrapper());
  afterEach(() => removeGrid(testGridTab1Id));
  describe('Positive Test Cases', () => {
    it('Should Update Successfully', async () => {
      // Given
      const response = {
        // Also contains dataFixId key
        message: 'Please use \'fix_data_type_of_existing_data/status\' api to check the status.'
      };

      // When
      const { data: responseData, error: responseError } = await updateColumnDatatype<TestGrid>(updateColumnDatatypeObject, testGridTab1Id);

      // Then
      expect(responseError).toEqual(undefined);
      expect(responseData).toMatchObject(response);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'System error. Please contact admin.',
        otherDetails: {},
        errorType: 'SYSTEMERROR',
        recoverable: false
      };

      // When
      const { data: responseData, error: responseError } = await updateColumnDatatype<TestGrid>(updateColumnDatatypeObject, 'INVALID_GRID_ID');

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid View Id', async () => {
      // Given
      const errorObject = {
        errorMessage: 'share Id invalid',
        otherDetails: {},
        errorType: 'DATAERROR',
        recoverable: true
      };

      // When
      const { data: responseData, error: responseError } = await updateColumnDatatype<TestGrid>(updateColumnDatatypeObject, testGridTab1Id, {
        viewId: 'INVALID_VIEW_ID',
      });
      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id (prod)', async () => {
      // Given
      const errorObject = {
        errorMessage: 'authId is invalid',
        otherDetails: {},
        errorType: 'AUTHERROR',
        recoverable: true
      };

      // When
      const { data: responseData, error: responseError } = await updateColumnDatatype<TestGrid>(updateColumnDatatypeObject, testGridTab1Id, {
        authId: 'INVALID_AUTHID',
      });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
    it('Should Reject Invalid Auth Id (qa)', async () => {
      // Given
      const errorObject = {
        errorMessage: 'authId is invalid',
        otherDetails: {},
        errorType: 'AUTHERROR',
        recoverable: true
      };

      // When
      const { data: responseData, error: responseError } = await updateColumnDatatype<TestGrid>(updateColumnDatatypeObject, testGridTab1Id, {
        authId: 'INVALID_AUTHID',
        qa: true
      });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
  });
});