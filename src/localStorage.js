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
  localStorage.setItem(localStorageKey, JSON.stringify(data));
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
  },
  theme: {
    get: getStoredTheme,
    set: storeTheme,
  },
};
