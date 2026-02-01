import type { CardExtendedData } from "../components/app.types";

/**
 * A categories change in history
 */
export interface CategoriesHistoryChangeItem {
  type: "categories";
  value: string[];
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
    categories: string[];
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
  categories: string[];
  cards: CardExtendedData[];
}

/**
 * The historical list of states of the board
 */
export type BoardHistory = BoardHistoryItem[];

export interface BoardHistoryWithIdx {
  boardHistory: BoardHistory;
  historyIdx: number;
}

interface SetAction {
  type: "set";
  historyItems: BoardHistory;
}

interface AddAction {
  type: "add";
  changeItem: HistoryChangeItem;
}

interface UpdateIdxAction {
  type: "updateIdx";
  newIdx: number;
}

export type HistoryAction = SetAction | AddAction | UpdateIdxAction;
