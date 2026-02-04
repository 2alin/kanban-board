import type { CategoryData } from "../app.types";

/**
 * Categories dispatch action to set a new list of categories
 */
interface SetAction {
  type: "set";
  /**
   * The new categories to set
   */
  categories: CategoryData[];
  /**
   * Whether the new state of categories should be added to history or not
   */
  addToHistory?: boolean;
}

/**
 * Categories dispatch action to rename a category
 */
interface RenameAction {
  type: "rename";
  /**
   * The Id of the category to rename
   */
  id: number;
  /**
   * The new name for the category
   */
  value: string;
  /**
   * Whether the new state of categories should be added to history or not
   */
  addToHistory?: boolean;
}

export type CategoryAction = SetAction | RenameAction;
