import type { BoardHistory, HistoryChangeItem } from "../components/app.types";

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
