import type { BoardData } from "./storage.types";

/**
 * Valid theme values
 */
export const themes = ["blackwhite", "color-1", "color-am-1", "color-am-2"];

/**
 * Default theme value
 */
export const defaultTheme = themes[1];

/**
 * Default board data
 */
export const defaultBoardData: BoardData = {
  version: "0.1",
  categories: ["backlog", "todo", "today", "done"],
  entries: [],
};
