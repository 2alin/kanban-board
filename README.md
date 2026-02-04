# Kanban Board

This projects creates a simple kanban board that is persistant across sessions.

<img width="1823" height="963" alt="Screenshot of the Kanban Board app dispaying a set of multiple cards assigned to different columns"  src="https://github.com/user-attachments/assets/2c7f72c7-4b99-400a-bab7-c5edb76fd78f" />

## Features

Currently it supports the following:

- Adding, removing and editing cards and columns
- Moving cards across the board through card buttons
- Drag and drop cards across the board
- Collapse columns
- Basic rich text in card content description (see details bellow)
- Undo and redo changes to the board data
- Import and exporting board data
- Theme selection

For features to come or for suggesting features please check the [project's issues section](https://github.com/2alin/kanban-board/issues).

## Try it out

A live version of the project can be found on https://adilson.mx/kanban-board

## Rich text in card content description

Card description support rich text:

- For bold text, wrap the text with double star or double underscore characters: `**bold**` or `__bold__` will be shown as **bold**.
- For italic text, wrap the text with single star or single underscore characters: `*italic*` or `_italic_` will be shown as _italic_.
- For unformatted text, wrap the text with single grave accent characters: \`code\` will be shown as `code`.
- For links, just write the full URL of the link: `https://example.com` will be shown as https://example.com

## Development

### Requirements

- Node v22.20+
- Playwright (for testing only)
  - `npx playwright install --with-deps`

### Project setup

- Run `npm i` to install npm dependencies.

### Testing and building

- Run `npm run lint` to check project linting with eslint.
- Run `npm run test` to run all tests (unit and component) in headless browser mode.
  - Alternatively run `npm run test-unit` for unit tests or `npm run test-browser` for component tests.
- Run `npm run dev` to start a local web server with the project in development mode.
- Run `npm run build` to build the project in the`dist/` directory.


## Acknowledgements

### Icons

The icons used in this project have been taken from the Lucide open-source code library. Please consider contributing to [their project](https://github.com/lucide-icons/lucide).
