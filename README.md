# bigparser

![bigparser — A New Way to Search Your Data](assets/bigparser.png)

> An [Open Source Universe](https://github.com/intellibus/approach) Project

---

## Contents

- [bigparser](#bigparser)
  - [Contents](#contents)
  - [Features ✨](#features-)
  - [Install 🛠](#install-)
  - [Usage 🔭](#usage-)
  - [Documentation 🛰](#documentation-)
  - [Contributing 🌎](#contributing-)
  - [License ⚖️](#license-️)

## Features ✨

- Query Existing Grids (using `search`, `searchCount` & `searchDistinct`)
- Add Data to Existing Grids (using `insert`)
- Update Data in Existing Grids (using `updateByQuery` & `updateByRowId`)
- Delete Data in Existing Grids (using `deleteByQuery` & `deleteByRowId`)
- Update Column Data Types (using `updateColumnDatatype`)
- Get Grid Metadata (using `getHeaders` & `getMultisheetMetadata`)
- Create New Grids from a Data Model (`Coming Soon`)
- Generate Data Model Types from BigParser Grid (`Coming Soon`)

## Install 🛠

```sh
npm install bigparser
```

## Usage 🔭

Set the `BP_AUTH_TOKEN` environment variable to your BigParser Auth Id.

This can be done in the terminal

```sh
export BP_AUTH_TOKEN=YOUR_AUTH_TOKEN
```

OR using a .env file

```txt
BP_AUTH_TOKEN=YOUR_AUTH_TOKEN
```

OR using process.env

```typescript
process.env.BP_AUTH_TOKEN = 'YOUR_AUTH_TOKEN'
```

Optionally you can also set the `BP_QA` environment variable to `true` to use `qa.bigparser.com` instead of `www.bigparser.com`

Below is an example of calling one of the APIs methods with a Grid Data Model

```typescript
import { search } from 'bigparser'

declare type GridDataModel {
  Country: string;
  Airport: string;
  Airlines: string;
  NumPlanes: number;
  HasLounge: boolean;
}

const { data: searchData, error: searchError } = await search<GridDataModel>({
  query: {
    globalFilter: {
      filters: [
        {
          operator: 'LIKE',  // default like (optional)
          keyword: 'United',
        },
        {
          operator: 'NLIKE',
          keyword: 'Airlines',
        },
      ],
      filtersJoinOperator: 'OR' // default OR (optional)
    },
    columnFilter: {
      filters: [
        {
          column: 'Country',
          operator: 'LIKE',  // default like (optional)
          keyword: 'South'
        },
        {
          column: 'Country',
          operator: 'NLIKE',   // default like (optional)
          keyword: 'America'

        }
      ],
      filtersJoinOperator: 'AND'  // default AND (optional)
    },
    globalColumnFilterJoinOperator: 'OR', // default OR  (optional)
    sendRowIdsInResponse: true,
    showColumnNamesInResponse: true,
    pagination: {
      startRow: 1,
      rowCount: 50
    },
    sort: {
      NumPlanes: 'desc'
    },
    selectColumnNames: [
      'Airport',
    ],
  }
}, 'YOUR_GRID_ID')

if (searchError || !searchData) {
  console.log('Network Error')
}

console.log(searchData)
/*
  {
    totalRowCount: 76,
    rows: [
      {
        "Airport": "JNB"
      },
      {
        "Airport": "CPT"
      }
      ...
    ]
  }
*/
```

## Documentation 🛰

Full documentation on the bigparser APIs can be found at [api.bigparser.com](https://api.bigparser.com)

## Contributing 🌎

We would love for you to contribute your ideas, code, & fixes to `bigparser`.

Also check out the [rewards](https://github.com/intellibus/approach/blob/main/REWARDS.md) offered for contributing to the [Open Source Universe](https://github.com/intellibus/approach).

## License ⚖️

MIT
