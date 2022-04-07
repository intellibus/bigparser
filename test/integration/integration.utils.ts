import {
  bulkCrud,
  createGrid,
  createTab,
  deleteGrid,
  getGridMetadata,
  insert,
  setupLinkedColumn,
  updateColumnDataSource,
} from '../../src/index';
import { BlankGrid } from '../__grids__/BlankGrid';
import { TestGrid } from '../__grids__/TestGrid';
import { TestGrid2 } from '../__grids__/TestGrid2';

async function setupGridColumns(columns, gridId) {
  const { data: testGridBulkCrudResponse } = await bulkCrud<BlankGrid>(
    {
      insertColumns: [
        {
          columns,
        },
      ],
      deleteColumns: {
        columns: [
          {
            columnName: 'Column 1',
          },
          {
            columnName: 'Column 2',
          },
          {
            columnName: 'Column 3',
          },
          {
            columnName: 'Column 4',
          },
          {
            columnName: 'Column 5',
          },
        ],
      },
    },
    gridId
  );

  expect(testGridBulkCrudResponse).toMatchObject({
    insertRows: null,
    updateRows: null,
    deleteRows: null,
    insertColumns: [
      {
        noOfColumnsUpdated: columns.length,
      },
    ],
    deleteColumns: {
      noOfColumnsUpdated: 5,
    },
    renameColumns: null,
  });
}

export async function bootstrapIntegrationTests() {
  // Create Grid w/ 2 Tabs
  const {
    data: { gridId: testGridId },
  } = await createGrid({
    gridName: 'Testing Grid',
    gridTabs: [
      {
        tabName: 'Test Tab',
      },
    ],
  });

  expect(testGridId).toBeTruthy();

  const {
    data: { gridId: linkedDataTabGridId },
  } = await createTab(
    {
      tabName: 'Linked Data Tab',
    },
    testGridId
  );

  expect(linkedDataTabGridId).toBeTruthy();

  // Setup Columns for Both Tabs
  await setupGridColumns(
    [
      { columnName: 'String Column', dataType: 'STRING' },
      { columnName: 'Number Column', dataType: 'NUMBER' },
      { columnName: 'Number 2 Column', dataType: 'NUMBER' },
      { columnName: 'Boolean Column', dataType: 'BOOLEAN' },
      { columnName: 'Date Column', dataType: 'DATE' },
      { columnName: 'Date Time Column', dataType: 'DATE_TIME' },
      { columnName: 'Linked Column', dataType: 'STRING' },
      {
        columnName: 'Linked Related Column From Other Grid',
        dataType: 'STRING',
      },
      { columnName: 'Formula Column', dataType: 'NUMBER' },
      { columnName: 'Empty Column', dataType: 'STRING' },
    ],
    testGridId
  );
  await setupGridColumns(
    [
      { columnName: 'Source Column', dataType: 'STRING' },
      { columnName: 'Linked Related Column', dataType: 'STRING' },
    ],
    linkedDataTabGridId
  );

  // Setup Column Linking
  const { data: setupLinkedColumnResponse } = await setupLinkedColumn<
    TestGrid,
    TestGrid2
  >({
    destinationColumnName: 'Linked Column',
    destinationGridId: testGridId,
    linkedRelatedColumns: [
      {
        destColName: 'Linked Related Column From Other Grid',
        srcColName: 'Linked Related Column',
      },
    ],
    sourceColumnName: 'Source Column',
    sourceGridId: linkedDataTabGridId,
  });

  expect(setupLinkedColumnResponse).toBe('');

  // Setup Formula Column
  const { data: updateColumnDataSourceResponse } =
    await updateColumnDataSource<TestGrid>(
      {
        columns: [
          {
            columnDataSource: {
              columnNames: ['Number Column', 'Number 2 Column'],
              functionType: 'SUM',
            },
            columnName: 'Formula Column',
          },
        ],
      },
      testGridId
    );

  expect(updateColumnDataSourceResponse).toBe('');

  // Add Test Data to Both Tabs
  const { data: linkedDataTabInsertResponse } = await insert<TestGrid2>(
    {
      insert: {
        rows: [
          {
            'Source Column': '20171',
            'Linked Related Column': 'Related Column Value 1',
          },
          {
            'Source Column': '20172',
            'Linked Related Column': 'Related Column Value 2',
          },
        ],
      },
    },
    linkedDataTabGridId
  );

  expect(linkedDataTabInsertResponse).toBeTruthy();

  const {
    data: {
      createdRows: { 0: firstRowId, 1: secondRowId },
    },
  } = await insert<TestGrid>(
    {
      insert: {
        rows: [
          {
            'String Column': 'Example String',
            'Number Column': 1337,
            'Number 2 Column': 1234.5678,
            'Boolean Column': true,
            'Date Column': '2022-04-07T22:51:11.491Z',
            'Date Time Column': '2022-04-07T22:51:11.491Z',
            'Linked Column': '20171',
            'Linked Related Column From Other Grid': 'Related Column Value 1',
          },
          {
            'String Column': 'Example String',
            'Number Column': 10,
            'Number 2 Column': 11,
            'Boolean Column': false,
            'Date Column': '2022-04-07T22:51:11.491Z',
            'Date Time Column': '2022-04-07T22:51:11.491Z',
            'Linked Column': '20172',
            'Linked Related Column From Other Grid': 'Related Column Value 2',
          },
        ],
      },
    },
    testGridId
  );

  expect(firstRowId).toBeTruthy();
  expect(secondRowId).toBeTruthy();

  // return gridId & rowIds
  return { testGridId, linkedDataTabGridId, firstRowId, secondRowId };
}

export async function cleanupIntegrationTests(gridId: string) {
  // Get File Id for Grid
  const {
    data: { fileId },
  } = await getGridMetadata(gridId);

  expect(fileId).toBeTruthy();

  // Delete Grid
  const { data: deleteGridResponse } = await deleteGrid(fileId);

  expect(deleteGridResponse).toBe('');
}
