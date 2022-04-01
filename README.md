# bigparser

<div align="center">
  <a href="#">
    <img src="assets/fun.gif" alt="I eat data for breakfast" height="160" />
  </a>
  <br>
  <br>
  <p>
    <b>bigparser</b>
  </p>
  <p>
     <i>A New Way to Search your Data with BigParser APIs.</i>
  </p>
  <p>

[![NPM version](https://img.shields.io/npm/v/bigparser?style=flat-square)](https://img.shields.io/npm/v/bigparser?style=flat-square)
[![HEAD Build Status](https://github.com/intellibus/bigparser/actions/workflows/CI.yml/badge.svg?style=flat-square)](https://github.com/intellibus/bigparser/actions/workflows/CI.yml)
[![Release Build Status](https://github.com/intellibus/bigparser/actions/workflows/CD.yml/badge.svg?style=flat-square)](https://github.com/intellibus/bigparser/actions/workflows/CD.yml)
[![Test Coverage](https://api.codeclimate.com/v1/badges/64436d03e7566e8e9bee/test_coverage)](https://codeclimate.com/github/intellibus/bigparser/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/64436d03e7566e8e9bee/maintainability)](https://codeclimate.com/github/intellibus/bigparser/maintainability)
[![Contributors](https://img.shields.io/github/contributors-anon/intellibus/bigparser?style=flat-square)](https:/github.com/intellibus/bigparser/graphs/contributors)
[![Package size](https://img.shields.io/bundlephobia/min/bigparser?style=flat-square)](https://bundlephobia.com/package/bigparser)
[![Dependencies](https://img.shields.io/librariesio/github/intellibus/bigparser?style=flat-square)](https://libraries.io/npm/bigparser)
[![Version Support](https://img.shields.io/node/v/bigparser?style=flat-square)](https://npmjs.com/package/bigparser)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

  </p>
</div>

---

## Contents

- [bigparser](#bigparser)
  - [Contents](#contents)
  - [Features ✨](#features-)
  - [Install 🐙](#install-)
  - [Usage 💡](#usage-)
  - [Documentation 📄](#documentation-)
  - [Contributing 🍰](#contributing-)
  - [Maintainers 👷](#maintainers-)
  - [License ⚖️](#license-️)

## Features ✨

- Query Existing Grids (using `search`, `searchCount` & `searchDistinct`)
- Add Data to Existing Grids (using `insert`)
- Update Data in Existing Grids (using `updateByQuery` & `updateByRowId`)
- Delete Data in Existing Grids (using `deleteByQuery` & `deleteByRowId`)
- Update Column Data Types (using `updateColumnDatatype`)
- Get Grid Metadata (using `getHeaders` & `getMultisheetMetadata`)
- Create New Grids from a Data Model (Coming Soon)
- Generate Data Model Types from BigParser Grid (Coming Soon)

## Install 🐙

If using `npm`:

```sh
npm install bigparser
```

If using `yarn`:

```sh
yarn install bigparser
```

If using `pnpm`:

```sh
pnpm install bigparser
```

## Usage 💡

Set the `BP_AUTH` environment variable to your BigParser Auth Id.

This can be done in the terminal

```sh
export BP_AUTH=YOUR_AUTH_ID
```

OR using a .env file

```txt
BP_AUTH=YOUR_AUTH_ID
```

OR using process.env

```typescript
process.env.BP_AUTH = 'YOUR_AUTH_ID'
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

## Documentation 📄

Full documentation on the bigparser APIs can be found at [api.bigparser.com](https://api.bigparser.com)

## Contributing 🍰

Please make sure to read the [Contributing Guide](CONTRIBUTING.md) before making a pull request.

Thank you to all the people who already contributed to this project!

## Maintainers 👷

<table>
  <tr>
    <td align="center"><a href="https://anubis.me/"><img src="https://avatars3.githubusercontent.com/u/15962062?s=460&v=4" width="100px;" alt="Anubis"/><br /><sub><b>Anubis</b></sub></a><br /><a href="#" title="Code">💻</a></td>
    <td align="center"><a href=""><img src="https://avatars3.githubusercontent.com/u/93603340?s=460&v=4" width="100px;" alt="jkeegan2"/><br /><sub><b>jkeegan2</b></sub></a><br /><a href="#" title="Code">💻</a></td>
    <td align="center"><a href=""><img src="https://avatars3.githubusercontent.com/u/37832457?s=460&v=4" width="100px;" alt="Hasna Hena Mow"/><br /><sub><b>Hasna Hena Mow</b></sub></a><br /><a href="#" title="Code">💻</a></td>
    <td align="center"><a href=""><img src="https://avatars3.githubusercontent.com/u/61206601?s=460&v=4" width="100px;" alt="Dinu"/><br /><sub><b>Dinu</b></sub></a><br /><a href="#" title="Code">💻</a></td>
  </tr>
</table>

## License ⚖️

MIT
