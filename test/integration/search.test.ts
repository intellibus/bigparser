import axios, { AxiosError } from 'axios';
import {
  search,
  insert
} from '../../src/index';
import {
  TestGrid,
  TestGridObject,
  TestGridTab2,
  TestGridTab2Object
} from '../__grids__/TestGrid';
import {
  QueryObject
} from '../../src/types'

jest.disableAutomock();
jest.unmock('axios');

const { BP_AUTH } = process.env;

let testGridTab1Id: string;
let testGridTab2Id: string;
let row1Id: string;
// let row2Id: string;

const queryObject: QueryObject<TestGrid> = {
  query: {
    columnFilter: {
      filters: [
        {
          column: 'Boolean Column',
          operator: 'EQ',
          keyword: true
        }
      ]
    },
    sendRowIdsInResponse: true,
    showColumnNamesInResponse: true,
  },
};

const modifyColumns = async () => {
  const modifyColumnsObject = {
    insertColumns: [
      {
        beforeColumn: 'Column 1',
        columns: []
      }
    ],
    deleteColumns: {
      columns: [
        {
          columnName: 'Column 1'
        },
        {
          columnName: 'Column 2'
        },
        {
          columnName: 'Column 3'
        },
        {
          columnName: 'Column 4'
        },
        {
          columnName: 'Column 5'
        }
      ]
    }
  };
  modifyColumnsObject.insertColumns[0].columns = Object.keys(TestGridObject).reduce((arr, key) => {
    arr.push({
      columnName: key,
      dataType: TestGridObject[key]
    });
    return arr;
  }, []);

  await axios.post(`https://www.bigparser.com/api/v2/grid/${testGridTab1Id}/rows_columns/bulk_crud`,
    modifyColumnsObject,
    {
      headers: {
        authId: BP_AUTH
      }
    }
  );

  modifyColumnsObject.insertColumns[0].columns = [];

  modifyColumnsObject.insertColumns[0].columns = Object.keys(TestGridTab2Object).reduce((arr, key) => {
    arr.push({
      columnName: key,
      dataType: TestGridTab2Object[key]
    });
    return arr;
  }, []);
  await axios.post(`https://www.bigparser.com/api/v2/grid/${testGridTab2Id}/rows_columns/bulk_crud`,
    modifyColumnsObject,
    {
      headers: {
        authId: BP_AUTH
      }
    }
  );
}

const setColumnLinking = async () => {
  await axios.put('https://www.bigparser.com/api/v2/grid/setup_linked_column',
    {
      destinationColumnName: 'Linked Column',
      destinationGridId: testGridTab1Id,
      linkedRelatedColumns: [
        {
          destColName: 'Linked Related Column From Other Grid',
          srcColName: 'Linked Related Column'
        }
      ],
      queryInSourceGrid: null,
      sourceColumnName: 'Source Column',
      sourceGridId: testGridTab2Id
    },
    {
      headers: {
        authId: BP_AUTH
      }
    }
  );
}

const setDataSource = async () => {
  await axios.put(`https://www.bigparser.com/api/v2/grid/${testGridTab1Id}/update_column_dataSource`,
    {
      columns: [
        {
          columnDataSource: {
            columnNames: ['Number Column', 'Number 2 Column'],
            functionType: 'SUM'
          },
          columnName: 'Formula Column'
        }
      ]
    }, {
      headers: {
        authId: BP_AUTH
      }
    }
  );
}

const insertValues = async () => {
  await insert<TestGridTab2>(
    {
      insert: {
        rows: [
          {
            'Source Column': '20171',
            'Linked Related Column': 'Related Column Value 1'
          },
          {
            'Source Column': '20172',
            'Linked Related Column': 'Related Column Value 2'
          }
        ]
      }
    },
    testGridTab2Id
  );

  const insertResponse = await insert<TestGrid>(
    {
      insert: {
        rows: [
          {
            'String Column': 'Example String',
            'Number Column': 1337,
            'Number 2 Column': 1234.5678,
            'Boolean Column': true,
            'Date Column': '2022-04-4 12:15:30',
            'Linked Column': '20171'
          },
          {
            'String Column': 'Example String 2',
            'Number Column': 10,
            'Number 2 Column': 11,
            'Boolean Column': false,
            'Date Column': '2021-03-15 1:30:30',
            'Linked Column': '20172'
          }
        ]
      }
    },
    testGridTab1Id
  );
  ({ 0: row1Id, /* 1: row2Id */} = insertResponse.data.createdRows);
}

const populateGrids = async () => {
  await modifyColumns();
  await setColumnLinking();
  await setDataSource();
  await insertValues();  
}

const createGrids = async () => {
  const createResponse = await axios.post('https://www.bigparser.com/api/v2/grid/create_grid', {
    gridName: 'integrationTestGrid',
    gridTabs: [
      {
        tabName: 'Test Grid'
      }
    ]
  }, {
    headers: {
      authId: BP_AUTH
    }
  });
  testGridTab1Id = createResponse.data.gridId;

  const addResponse = await axios.post(`https://www.bigparser.com/api/v2/grid/${testGridTab1Id}/create_tab`,
    {
       tabName: 'Linked Data Tab'
    },
    {
      headers: {
        authId: BP_AUTH
      }
    }
  );
  testGridTab2Id = addResponse.data.gridId;
  await populateGrids();
}

const removeGrids = async () => {
  let startIndex = 1;
  let max = Infinity;
  let fileId = '';
  const gridId = testGridTab1Id; // needed for safe reference
  while (!fileId && startIndex < max) {
    // eslint-disable-next-line no-await-in-loop
    const gridsResponse = await axios.get(`https://www.bigparser.com/APIServices/api/grid/get_grids?startIndex=${startIndex}&endIndex=${startIndex+9}`, {
      headers: {
        authId: BP_AUTH
      }
    });
    max = gridsResponse.data.count;
    fileId = gridsResponse.data.files.reduce((id: string, file) => {
      if (id) {
        return id;
      }
      if (file.gridId === gridId) {
        return file.id;
      }
      return '';
    }, '');
    startIndex += 10;
  }
  if (fileId) {
    await axios.delete('https://www.bigparser.com/APIServices/api/file/remove', {
      headers: {
        authId: BP_AUTH
      },
      data: {
        id: fileId
      }
    });
  }
}

const beforeEachWrapper = async () => {
  jest.resetModules();
  await createGrids();
}

describe('Search', () => {
  beforeEach(() => beforeEachWrapper());
  afterEach(() => removeGrids());
  describe('Positive Test Cases', () => {
    it('Should Return Grid Data', async () => {
      // Given
      const gridData = {
        totalRowCount: 1,
        rows: [
          {
            _id: row1Id,
            'String Column': 'Example String',
            'Number Column': 1337,
            'Number 2 Column': 1234.5678,
            'Boolean Column': true,
            'Date Column': '2022-04-04 12:15:30.000',
            'Linked Column': '20171',
            'Linked Related Column From Other Grid': null,
            'Formula Column': null,
            'Empty Column': null
          },
        ],
      };

      // When
      const { data: responseData, error: responseError } = await search<TestGrid>(queryObject, testGridTab1Id);

      // Then
      expect(responseError).toEqual(undefined);
      expect(responseData).toEqual(gridData);
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
      const { data: responseData, error: responseError } = await search<TestGrid>(queryObject, 'INVALID_GRID_ID');

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
      const { data: responseData, error: responseError } = await search<TestGrid>(queryObject, testGridTab1Id, {
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
      const { data: responseData, error: responseError } = await search<TestGrid>(queryObject, testGridTab1Id, {
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
      const { data: responseData, error: responseError } = await search<TestGrid>(queryObject, testGridTab1Id, {
        authId: 'INVALID_AUTHID',
        qa: true
      });

      // Then
      expect(responseData).toEqual(undefined);
      expect((responseError as AxiosError).response.data).toEqual(errorObject);
    });
  });
});