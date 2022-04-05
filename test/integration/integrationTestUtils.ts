import axios from 'axios';
import {
  getHeaders,
  updateColumnDataSource,
  insert,
  createGrid,
  createTab,
  setupLinkedColumn
} from '../../src/index';
import {
  TestGrid,
  TestGridObject,
  TestGridTab2,
  TestGridTab2Object
} from '../__grids__/TestGrid';

const { BP_AUTH } = process.env;

const modifyColumns = async (
  gridTab1Id: string,
  gridTab2Id: string
) => {
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

  await axios.post(`https://www.bigparser.com/api/v2/grid/${gridTab1Id}/rows_columns/bulk_crud`,
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
  await axios.post(`https://www.bigparser.com/api/v2/grid/${gridTab2Id}/rows_columns/bulk_crud`,
    modifyColumnsObject,
    {
      headers: {
        authId: BP_AUTH
      }
    }
  );
}

const setColumnLinking = async (
  gridTab1Id: string,
  gridTab2Id: string
) => {
  await setupLinkedColumn<TestGrid, TestGridTab2>(
    {
      destinationColumnName: 'Linked Column',
      destinationGridId: gridTab1Id,
      linkedRelatedColumns: [
        {
          destColName: 'Linked Related Column From Other Grid',
          srcColName: 'Linked Related Column'
        }
      ],
      queryInSourceGrid: null,
      sourceColumnName: 'Source Column',
      sourceGridId: gridTab2Id
    }
  );
}

const setDataSource = async (
  gridTab1Id: string
) => {
  await updateColumnDataSource<TestGrid>(
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
    },
    gridTab1Id
  );
}

const insertValues = async (
  gridTab1Id: string,
  gridTab2Id: string
) => {
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
    gridTab2Id
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
            'String Column': 'Example String',
            'Number Column': 10,
            'Number 2 Column': 11,
            'Boolean Column': false,
            'Date Column': '2021-03-15 1:30:30',
            'Linked Column': '20172'
          }
        ]
      }
    },
    gridTab1Id
  );

  const { 0: row1Id, 1: row2Id } = insertResponse.data.createdRows;
  return [row1Id, row2Id];
}

export const createGrids = async () => {
  const { data: data1 } = await createGrid({
    gridName: 'integrationTestGrid',
    gridTabs: [
      {
        tabName: 'Test Grid'
      }
    ]
  });
  const gridTab1Id = data1.gridId;

  const { data: data2 } = await createTab(
    {
       tabName: 'Linked Data Tab'
    },
    gridTab1Id
  );
  const gridTab2Id = data2.gridId;

  await modifyColumns(gridTab1Id, gridTab2Id);
  await setColumnLinking(gridTab1Id, gridTab2Id);
  await setDataSource(gridTab1Id);

  const [row1Id, row2Id] = await insertValues(gridTab1Id, gridTab2Id);
  return [gridTab1Id, gridTab2Id, row1Id, row2Id];
}

// TODO: add removeGrid method? How to get fileId in method
export const removeGrid = async (gridId: string) => {
  const { data } = await getHeaders(gridId);
  if (data) {
    await axios.delete(
      "https://www.bigparser.com/APIServices/api/file/remove",
      {
        headers: {
          authId: BP_AUTH,
        },
        data: {
          id: data.fileId,
        },
      }
    );
  }
};