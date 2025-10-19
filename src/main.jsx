import { createRoot } from "react-dom/client";

import {
  boardData as defaultBoardData,
  defaultTheme,
  validThemes,
} from "./defaultSettings.js";
import storage from "./storage.js";

import App from "./components/app";

/**
 * Migrates olver versions of board data to the newest version
 */
function migrateData(boardData) {
  if (!boardData.version) {
    boardData.version = defaultBoardData.version;
    storage.board.set(boardData);
  }
}

function handleThemeSelection(event) {
  const { target } = event;
  const { theme: themeSelected } = target.closest("[data-theme]").dataset;
  document.body.dataset.theme = themeSelected;
  storage.theme.set(themeSelected);
}

/**
 * Initializes the main app
 */
async function initialize() {
  let initialTheme = storage.theme.get();
  if (!validThemes.includes(initialTheme)) {
    initialTheme = defaultTheme;
    storage.theme.set(initialTheme);
  }
  document.body.dataset.theme = initialTheme;

  // initialize app memory data
  let initialBoardData = storage.board.get();
  if (!initialBoardData) {
    storage.board.set(defaultBoardData);
    initialBoardData = storage.board.get();
  } else if (initialBoardData.version !== defaultBoardData.version) {
    initialBoardData = migrateData(initialBoardData);
  }

  const root = createRoot(document.getElementById("root"));
  root.render(
    <App
      initialCategories={initialBoardData.categories}
      initialCards={initialBoardData.entries}
      handleThemeSelection={handleThemeSelection}
    />
  );
}

initialize();
