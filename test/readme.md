# Description

This document contains all the documentation around testings

# Unit and component tests

All unit and component tests should be located in the same directory as the related module. Unit tests have `.unit.test` before its file extension and component tests have `.browser.test`. 


To run all unit and component tests, please use `npm run test`. Or use`npm run test-watch` to enter watch mode.

# Manual Tests

Please see the [manual tests](./manual-tests.md) document for manual smoke tests that needs to be tested before releasing a new feature.

## Custom components smoke tests

The [`smoke-ui/`](./smoke-ui/) directory contains pages that can be used to manual test custom components. Use `npm run smoke-ui` to serve their index page.

# Tests reusable data

The [`data/`](./data/) directory should contain data to be reused by tests.
