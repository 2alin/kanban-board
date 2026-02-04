import { themes } from "../defaultSettings";

const themeStorageKey = "theme";

/**
 * Gets the theme locally stored
 *
 * @returns The theme locally stored
 */
function get(): string | null {
  let storedTheme;

  try {
    storedTheme = localStorage.getItem(themeStorageKey);
  } catch (error) {
    console.error(
      "[storage.theme.get] Couldn't retrieve the stored theme",
      error,
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
function set(theme: string): boolean {
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
  get,
  set,
};
