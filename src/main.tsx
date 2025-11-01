import { createRoot } from "react-dom/client";

import { defaultBoardData, defaultTheme, themes } from "./defaultSettings";
import storage from "./storage";
import { getRandomId } from "./utilities";

import App from "./components/app";
import type { BoardData } from "./storage.types";
import type { CardExtendedData } from "./components/app.types";

function handleThemeChange(event: React.MouseEvent) {
  const { target } = event;
  if (!(target instanceof HTMLElement)) {
    console.error("[theme.change] Couldn't find the clicked HTML element");
    return;
  }

  const themeSelector = target.closest("[data-theme]");
  if (!(themeSelector instanceof HTMLElement)) {
    console.error("[theme.change] Couldn't find the HTML theme selector");
    return;
  }

  const { theme: themeSelected } = themeSelector.dataset;

  if (!themeSelected || !themes.includes(themeSelected)) {
    console.error("Theme selected is not supported");
    return;
  }

  storage.theme.set(themeSelected);
  document.body.dataset.theme = themeSelected;
}

/**
 * Initializes the main app
 */
async function initialize() {
  let initialTheme = storage.theme.get();
  if (!initialTheme || !themes.includes(initialTheme)) {
    initialTheme = defaultTheme;
    storage.theme.set(initialTheme);
  }
  document.body.dataset.theme = initialTheme;

  // initialize app memory data
  let initialBoardData = storage.board.get();
  if (!initialBoardData) {
    storage.board.set(defaultBoardData);
    initialBoardData = storage.board.get();
  }

  if (!initialBoardData) {
    console.error("Couldn't retrieve default board data from storage");
    initialBoardData = JSON.parse(
      JSON.stringify(defaultBoardData)
    ) as BoardData;
  }

  if (!initialBoardData.categories.length) {
    console.error("There was no categories stored");
    initialBoardData.categories = [...defaultBoardData.categories];
  }

  // add Ids to initial cards that will be used in memory only
  const initialCards: CardExtendedData[] = initialBoardData.entries.map(
    (entry) => {
      let categoryIdx = entry.categoryIdx;

      // handle entries that doesn't correspond to existing categories
      // send them to the first category in the list if it exists
      if (
        categoryIdx < 0 ||
        categoryIdx >= initialBoardData.categories.length
      ) {
        categoryIdx = 0;
      }

      return {
        id: getRandomId(),
        title: entry.title,
        description: entry.description || "",
        categoryIdx,
        orderInCategory: entry.orderInCategory,
      };
    }
  );

  const rootContainer = document.getElementById("root");
  if (!rootContainer) {
    console.error("No root container found");
    return;
  }

  const root = createRoot(rootContainer);
  root.render(
    <App
      initialCategories={initialBoardData.categories}
      initialCards={initialCards}
      handleThemeChange={handleThemeChange}
    />
  );
}

initialize();
