import { defaultBoardData, themes } from "./defaultSettings";
import type { BoardData, CardEntry } from "./storage.types";
import { hasPropertyPrimitiveTypes } from "./utilities";

const localStorageKey = "boardData";
const themeStorageKey = "theme";

/**
 * Checks if a candidate is of Card Entry type
 *
 * @param candidate The candidate to check
 * @returns Whether a candidate is of Card Entry type or not
 */
function isCardEntry(candidate: unknown): candidate is CardEntry {
  const propertyPrimitives = [
    { name: "category", type: "string" },
    { name: "title", type: "string" },
    { name: "categoryIdx", type: "number" },
  ];

  if (
    typeof candidate !== "object" ||
    candidate === null ||
    !hasPropertyPrimitiveTypes(candidate, propertyPrimitives)
  ) {
    return false;
  }

  return true;
}

/**
 * Checks if a candidate is of Board Data type
 *
 * @param candidate The candidate to check
 * @returns Whether a candidate is of Board Data type or not
 */
function isBoardData(candidate: unknown): candidate is BoardData {
  const propertyPrimitives = [{ name: "version", type: "string" }];

  if (
    typeof candidate !== "object" ||
    candidate === null ||
    !hasPropertyPrimitiveTypes(candidate, propertyPrimitives)
  ) {
    return false;
  }

  if (!("categories" in candidate) || !Array.isArray(candidate.categories)) {
    console.error("No 'categories' array found in candidate properties");
    return false;
  }
  for (const category of candidate.categories) {
    if (typeof category !== "string") {
      console.error("Category is not of type 'string'");
      return false;
    }
  }

  if (!("entries" in candidate) || !Array.isArray(candidate.entries)) {
    console.error("No 'entries' array found in candidate properties");
    return false;
  }
  for (const entry of candidate.entries) {
    if (!isCardEntry(entry)) {
      console.error("Entry is not of type 'CardEntry'");
      return false;
    }
  }

  return true;
}

/**
 * Historically board data types
 */
type AnyVersionBoardData = BoardData;

/**
 * Migrates older versions of board data to the newest version
 */
function migrateData(boardData: AnyVersionBoardData): BoardData {
  // we are expecting to have currently migrated
  // all users from a previous board data version
  // current version: "0.1"
  const newBoardData = JSON.parse(JSON.stringify(boardData));
  return newBoardData;
}

/**
 * Gets the board data stored locally
 *
 * @returns The board data stored locally or null if no data has been stored
 */
function getBoardData(): BoardData | null {
  let localData;

  try {
    const localDataRaw = localStorage.getItem(localStorageKey);

    if (!localDataRaw) {
      // no need to throw an error as it's expected there's no board data stored
      return null;
    }

    localData = JSON.parse(localDataRaw);
    if (localData.version !== defaultBoardData.version) {
      localData = migrateData(localData);
    }

    if (!isBoardData(localData)) {
      throw new Error("Local data doesn't have the right board data shape");
    }
  } catch (error) {
    console.error(
      "[storage.board.get] Couldn't get the stored board data",
      error
    );
    // there's possibilities that the data stored can't be parsed
    // fall back to a safe value that can be used for initialization
    localData = null;
  }

  return localData;
}

/**
 * Stores locally the app board data as a stringified object
 *
 * @param data The app board data to be stored
 * @returns Whether the data was successfully stored or not
 */
function setBoardData(data: unknown): boolean {
  if (!isBoardData(data)) {
    console.error("[storage.board.set] Wrong shape of board data");
    return false;
  }

  if (data.version !== defaultBoardData.version) {
    console.error("[storage.board.set] Wrong board data version");
    return false;
  }

  const dataToStore: BoardData = {
    version: defaultBoardData.version,
    categories: [...data.categories],
    entries: [...data.entries],
  };

  try {
    localStorage.setItem(localStorageKey, JSON.stringify(dataToStore));
  } catch (error) {
    console.error("[storage.board.set] Couldn't store locally", error);
    return false;
  }

  return true;
}

/**
 * Stores locally the card entries data
 *
 * @param cardEntries A list of card entries to store
 * @returns {boolean} Whether the cards where stored or not
 */
function setCardEntries(cardEntries: CardEntry[]) {
  const entriesToAdd = cardEntries.map((cardEntry) => ({
    categoryIdx: cardEntry.categoryIdx,
    category: cardEntry.category,
    title: cardEntry.title,
    description: cardEntry.description,
  }));

  try {
    const boardData = getBoardData();
    if (!boardData) {
      throw new Error("No board data found");
    }

    boardData.entries = [...entriesToAdd];

    const success = setBoardData(boardData);
    if (!success) {
      throw new Error("Couldn't store board data");
    }
  } catch (error) {
    console.error("[storage.entries.set] Couldn't store locally", error);
    return false;
  }

  return true;
}

/**
 * Gets the theme locally stored
 *
 * @returns The theme locally stored
 */
function getTheme(): string | null {
  let storedTheme;

  try {
    storedTheme = localStorage.getItem(themeStorageKey);
  } catch (error) {
    console.error(
      "[storage.theme.get] Couldn't retrieve the stored theme",
      error
    );
    storedTheme = null;
  }

  return storedTheme;
}

/**
 * Stores the theme in local storage
 *
 * @param theme The theme to store
 * @returns Wheter the theme was successfully stored or not
 */
function setTheme(theme: string): boolean {
  try {
    if (!themes.includes(theme)) {
      throw new Error("Theme value received is not supported");
    }

    localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    console.error("[storage.theme.set] Couldn't store the theme", error);
    return false;
  }

  return true;
}

export default {
  board: {
    get: getBoardData,
    set: setBoardData,
    entries: {
      set: setCardEntries,
    },
  },
  theme: {
    get: getTheme,
    set: setTheme,
  },
};
