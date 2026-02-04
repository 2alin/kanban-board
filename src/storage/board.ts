import { defaultBoardData } from "../defaultSettings";
import type { BoardData_v02 } from "./board.old.types";
import type { BoardData, CardEntry, CategoryEntry } from "./board.types";
import { hasPropertyPrimitiveTypes } from "../utilities";

const localStorageKey = "boardData";

/**
 * Checks if a candidate is of Card Entry type
 *
 * @param candidate The candidate to check
 * @returns Whether a candidate is of Card Entry type or not
 */
function isCardEntry(candidate: unknown): candidate is CardEntry {
  const propertyPrimitives = [
    { name: "categoryIdx", type: "number" },
    { name: "title", type: "string" },
    { name: "orderInCategory", type: "number" },
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
 * Checks if a candidate is of Category type
 *
 * @param candidate The candidate to check
 * @returns Whether a candidate is of Catetory type or not
 */
function isCategoryEntry(candidate: unknown): candidate is CategoryEntry {
  const propertyPrimitives = [
    { name: "isCollapsed", type: "boolean" },
    { name: "title", type: "string" },
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
    if (!isCategoryEntry(category)) {
      console.error("Entry is not of type 'CategoryEntry'");
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
type AnyVersionBoardData = BoardData | BoardData_v02;

/**
 * Migrates board data from v0.2 to v0.3
 *
 * @param oldBoardData Board data v0.2
 * @returns A converted board data v0.3
 */
function migrateDataV02toV03(oldBoardData: BoardData_v02): BoardData {
  const newCategories: CategoryEntry[] = oldBoardData.categories.map(
    (value) => ({
      isCollapsed: false,
      title: value,
    }),
  );

  const newBoardData: BoardData = {
    entries: structuredClone(oldBoardData.entries),
    categories: newCategories,
    version: "0.3",
  };

  return newBoardData;
}

/**
 * Migrates older versions of board data to the newest version
 */
export function migrateData(boardData: AnyVersionBoardData): BoardData {
  let newBoardData = JSON.parse(JSON.stringify(boardData));

  // ---------------------------
  // migrating from v0.2 to v0.3
  if (newBoardData.version === "0.2") {
    newBoardData = migrateDataV02toV03(newBoardData as BoardData_v02);
  }

  if (!isBoardData(newBoardData)) {
    console.error("Board data migration failed");
  } else {
    console.info("Board data migration was a success");
  }

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
      error,
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
    orderInCategory: cardEntry.orderInCategory,
    categoryIdx: cardEntry.categoryIdx,
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

export default {
  get: getBoardData,
  set: setBoardData,
  entries: {
    set: setCardEntries,
  },
};
