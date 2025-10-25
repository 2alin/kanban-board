import { createRoot } from "react-dom/client";

import { defaultBoardData, defaultTheme, themes } from "./defaultSettings";
import storage from "./storage";
import { getRandomId } from "./utilities";

import App from "./components/app";

/**
 * Migrates older versions of board data to the newest version
 */
function migrateData(boardData) {
  if (!boardData.version) {
    boardData.version = defaultBoardData.version;
    storage.board.set(boardData);
  }
}

function handleThemeChange(event) {
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
  if (!themes.includes(initialTheme)) {
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

  // add Ids to initial cards that will be used in memory only
  const initialCards = initialBoardData.entries.map((entry) => ({
    ...entry,
    id: getRandomId(),
  }));

  const root = createRoot(document.getElementById("root"));
  root.render(
    <App
      initialCategories={initialBoardData.categories}
      initialCards={initialCards}
      handleThemeChange={handleThemeChange}
    />
  );
}

initialize();
