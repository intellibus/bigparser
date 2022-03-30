import { search } from '../src/index';

describe('Search', () => {
  it('Should Return Grid Data', async () => {
    // Given
    const { TEST_GRID_ID } = process.env;
    const queryObject = {
      query: {
        sendRowIdsInResponse: true,
        showColumnNamesInResponse: true,
      },
    };
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
    const result = await search(queryObject, TEST_GRID_ID);

    // Then
    expect(result.data).toEqual(gridData);
  });
});
