import type { CardExtendedData, CategoryData } from "../app.types";


/**
 * A categories change in history
 */
export interface CategoriesHistoryChangeItem {
  type: "categories";
  value: CategoryData[];
}

/**
 * A cards change in history
 */
export interface CardsHistoryChangeItem {
  type: "cards";
  value: CardExtendedData[];
}

/**
 * A cards and categories change in history
 */
export interface FullHistoryChangeItem {
  type: "board";
  value: {
    categories: CategoryData[];
    cards: CardExtendedData[];
  };
}

/**
 * A change in history
 */
export type HistoryChangeItem =
  | CategoriesHistoryChangeItem
  | CardsHistoryChangeItem
  | FullHistoryChangeItem;

/**
 * The state of the board in a specific time in history
 */
export interface BoardHistoryItem {
  categories: CategoryData[];
  cards: CardExtendedData[];
}

/**
 * The historical list of states of the board
 */
export type BoardHistory = BoardHistoryItem[];

/**
 * Represents the list of board history states as well as
 * the current moment of history being shown to user
 */
export interface BoardHistoryWithIdx {
  /**
   * List of board history items that the board can use to update its data
   */
  boardHistory: BoardHistory;
  /**
   * Indicates the current moment in history that is being displayed to the user
   */
  historyIdx: number;
}

/**
 * History dispatch action to replace the list of items
 */
interface SetAction {
  type: "set";
  historyItems: BoardHistory;
}

/**
 * History dispatch action to add a new item
 */
interface AddAction {
  type: "add";
  changeItem: HistoryChangeItem;
}

/**
 * History dispatch action to update the current history index
 */
interface UpdateIdxAction {
  type: "updateIdx";
  newIdx: number;
}

export type HistoryAction = SetAction | AddAction | UpdateIdxAction;
