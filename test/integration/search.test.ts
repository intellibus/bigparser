import { search } from '../../src/index';
import { TestGrid } from '../__grids__/TestGrid';

describe('Search', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  describe('Positive Test Cases', () => {
    it('Should Return Grid Data', async () => {
      // Given
      const { TEST_GRID_ID } = process.env;

      const gridData = {
        totalRowCount: 1,
        rows: [
          {
            _id: '6243cd4ec9d082361703ea4e',
            'String Column': 'Example String',
            'Number Column': 1337,
            'Number 2 Column': 1234.5678,
            'Boolean Column': true,
            'Date Column':
              'Tue Mar 29 2022 23:20:30 GMT-0400 (Eastern Daylight Time)',
            'Linked Column': '20171',
            'Linked Related Column From Other Grid': 'Related Column Value 4',
            'Formula Column': null,
          },
        ],
      };

      // When
      const { data: searchData, error: searchError } = await search<TestGrid>(
        {
          query: {
            sendRowIdsInResponse: true,
            showColumnNamesInResponse: true,
          },
        },
        TEST_GRID_ID
      );
      // Then
      expect(searchError).toEqual(null);
      expect(searchData).toEqual(gridData);
    });
  });
  describe('Negative Test Cases', () => {
    it('Should Reject Invalid Grid Id', async () => {
      // When
      const { data: searchData, error: searchError } = await search<TestGrid>(
        {
          query: {
            sendRowIdsInResponse: true,
            showColumnNamesInResponse: true,
          },
        },
        ''
      );
      // Then
      expect(searchData).toEqual(null);
      expect(searchError).toBeTruthy();
    });
    it('Should Reject Invalid Auth Id', async () => {
      // Given
      const { TEST_GRID_ID } = process.env;
      // When
      const { data: searchData, error: searchError } = await search<TestGrid>(
        { query: {} },
        TEST_GRID_ID,
        '',
        'INVALID_AUTH_ID'
      );
      // Then
      expect(searchData).toEqual(null);
      expect(searchError).toBeTruthy();
    });
  });
});
