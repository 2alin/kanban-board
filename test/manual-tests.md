# Introduction

As we are currently lacking a test suite and we are continously adding features, we should have at least a list of manual smoke tests that should be done per feature change.


# Smoke tests

Note: keep the dev tools console open to detect any error

- Load the page without errors: for new users (private mode) and for old users (app data in local storage)
- Add a new card
- Change of category
- Edit the card (partial and full changes)
- Remove the card
- Import a valid board data json file
- Shouldn't import an invalid board data json file (e.g. invalid version number)
- Should be able to export the board data as json file. Such file can be tested is used as import file.
- Theme selector should work
- Board data and theme should be persistant


