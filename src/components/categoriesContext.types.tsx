/**
 * Categories dispatch action to set a new list of categories
 */
interface SetAction {
  type: "set";
  /**
   * The new categories to set
   */
  categories: string[];
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
}

export type Action = SetAction | RenameAction;
