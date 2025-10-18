import { createRoot } from "react-dom/client";
import {
  boardData as defaultBoardData,
  defaultTheme,
  validThemes,
} from "./defaultSettings.js";
import localStorage from "./localStorage.js";
import App from "./app.jsx";

/**
 * Migrates olver versions of board data to the newest version
 */
function migrateData(boardData) {
  if (!boardData.version) {
    boardData.version = defaultBoardData.version;
    localStorage.board.set(boardData);
  }
}

function handleThemeSelection(event) {
  const { target } = event;
  const { theme: themeSelected } = target.closest("[data-theme]").dataset;
  document.body.dataset.theme = themeSelected;
  localStorage.theme.set(themeSelected);
}

/**
 * Initializes the main app
 */
async function initialize() {
  let initialTheme = localStorage.theme.get();
  if (!validThemes.includes(initialTheme)) {
    initialTheme = defaultTheme;
    localStorage.theme.set(initialTheme);
  }
  document.body.dataset.theme = initialTheme;

  // initialize app memory data
  let initialBoardData = localStorage.board.get();
  if (!initialBoardData) {
    localStorage.board.set(defaultBoardData);
    initialBoardData = localStorage.board.get();
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
