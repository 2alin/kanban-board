# Description

This document contains all the documentation around testings

# Unit tests

All unit tests should be located in the same directory as the related module but with their filename prefixed by `.test` before its extension file. For example `module.test.ts` should contain the unit tests of `module.ts`.

To run all the unit tests, please use `npm run test`. Or use`npx vitest` to enter watch mode.

# Manual Tests

Please see the [manual tests](./manual-tests.md) document for manual smoke tests that needs to be tested before releasing a new feature.

## Custom components smoke tests

The [`smoke-ui/`](./smoke-ui/) directory contains pages that can be used to manual test custom components. Use `npm run smoke-ui` to serve their index page.

# Tests reusable data

The [`data/`](./data/) directory should contain data to be reused by tests.
