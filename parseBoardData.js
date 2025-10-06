import { boardData as defaultBoardData } from "./defaultSettings.js";

/**
 * Parses valid board data from a given source
 *
 * @param {object} data - default board data to parse
 */
export function parseBoardData(data) {
  if (!data.version || data.version !== defaultBoardData.version) {
    throw new Error(
      `Data version is older than the current supported: ${defaultBoardData.version}`
    );
  }

  if (!data.categories || !Array.isArray(data.categories)) {
    throw new Error("Data doesn't have a 'categories' array section");
  }

  if (!data.entries || !Array.isArray(data.entries)) {
    throw new Error("Data doesn't have an 'entries' array section");
  }

  // TODO: add checks for the entries type
  // TODO: improve the parsing process, only sent the exact data type is needed

  const parsedData = {
    version: defaultBoardData.version,
    categories: data.categories,
    entries: data.entries,
  };

  return parsedData;
}
