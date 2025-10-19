const localStorageKey = "boardData";
const themeStorageKey = "theme";

/**
 * Gets the app data stored locally
 *
 * @returns the app data stored locally as an object
 */
function getBoardData() {
  const localDataRaw = localStorage.getItem(localStorageKey);
  let localData;
  try {
    localData = JSON.parse(localDataRaw);
  } catch (error) {
    console.error(error);
    // there's possibilities that the data stored can't be parsed
    // fall back to a safe value that can be used for initialization
    localData = null;
  }
  return localData;
}

/**
 * Stores locally the app data as a stringified object
 *
 * @param {object} data the app data to be stored
 */
function setBoardData(data) {
  if (!data.categories || !data.entries || !data.version) {
    throw new Error("[localStorage.board.set] Wrong shape of board data");
  }

  localStorage.setItem(localStorageKey, JSON.stringify(data));
}

/**
 * @throws if the shape of the card is not the right one
 */
function checkCardShape(card) {
  const shape = new Map([
    ["category", { required: true, type: "string" }],
    ["title", { required: true, type: "string" }],
    ["description", { required: true, type: "string" }],
    ["categoryIdx", { required: true, type: "number" }],
  ]);

  for (const [fieldName, { required, type }] of shape.entries()) {
    if (!required) {
      continue;
    }

    if (!(fieldName in card)) {
      throw new Error(
        `Card data doesn't contain the required field '${fieldName}'`
      );
    }

    if (typeof card[fieldName] !== type) {
      throw new Error(
        `Card data field '${fieldName}' is not of type '${type}'`
      );
    }
  }
}

/**
 * Stores locally the cards data as part of the board local data
 *
 * @param {object[]} cards - the list of cards to store
 * @returns {boolean} whether the cards where stored or not
 */
function setCardsData(cards) {
  cards.forEach((card) => {
    try {
      checkCardShape(card);
    } catch (error) {
      console.error("Card doesn't have the right shape", card);
      console.error(error);
      return false;
    }
  });

  const boardData = getBoardData();
  boardData.entries = [...cards];
  setBoardData(boardData);
  return true;
}

/**
 * Retrieves the theme locally stored
 */
function getStoredTheme() {
  const storedTheme = localStorage.getItem(themeStorageKey);
  return storedTheme;
}

/**
 * Sets the theme in local storage
 *
 * @param {string} theme
 */
function storeTheme(theme) {
  localStorage.setItem(themeStorageKey, theme);
}

export default {
  board: {
    get: getBoardData,
    set: setBoardData,
    cards: {
      set: setCardsData,
    },
  },
  theme: {
    get: getStoredTheme,
    set: storeTheme,
  },
};
