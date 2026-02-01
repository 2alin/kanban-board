import {
  createContext,
  useReducer,
  type ActionDispatch,
  type PropsWithChildren,
} from "react";
import {} from "../components/app.types";
import type {
  BoardHistory,
  BoardHistoryWithIdx,
  HistoryAction,
  HistoryChangeItem,
} from "./history.types";

// Maximum amount of history items that can be stored
export const maxHistoryAmount = 10;

export const HistoryContext = createContext<BoardHistory>([]);
export const HistoryIndexContext = createContext<number>(-1);
export const HistoryDispatchContext = createContext<
  ActionDispatch<[action: HistoryAction]>
>(() => {});

interface HistoryProviderProps {
  initBoardHistoryWithIdx: BoardHistoryWithIdx;
}

export function HistoryProvider({
  initBoardHistoryWithIdx,
  children,
}: PropsWithChildren<HistoryProviderProps>) {
  const [boardHistoryWithIdx, dispatch] = useReducer(
    historyReducer,
    initBoardHistoryWithIdx,
  );

  const { boardHistory, historyIdx } = boardHistoryWithIdx;

  return (
    <HistoryContext value={boardHistory}>
      <HistoryIndexContext value={historyIdx}>
        <HistoryDispatchContext value={dispatch}>
          {children}
        </HistoryDispatchContext>
      </HistoryIndexContext>
    </HistoryContext>
  );
}

function historyReducer(
  boardHistoryWithIdx: BoardHistoryWithIdx,
  action: HistoryAction,
): BoardHistoryWithIdx {
  switch (action.type) {
    case "set": {
      const newBoardHistory = structuredClone(action.historyItems);
      return {
        boardHistory: newBoardHistory,
        historyIdx: newBoardHistory.length - 1,
      };
    }
    case "add": {
      const newBoardHistory = addChangeItem(
        boardHistoryWithIdx,
        action.changeItem,
      );
      return newBoardHistory;
    }
    case "updateIdx": {
      return {
        boardHistory: boardHistoryWithIdx.boardHistory,
        historyIdx: action.newIdx,
      };
    }
    default:
      return structuredClone(boardHistoryWithIdx);
  }
}

/**
 * Adds board changes to the history and updates history index
 *
 * @param boardHistoryWithIdx An object containing board history and index
 * @param changeItem A board history change
 * @returns A new object containing updated board history and index
 */
export function addChangeItem(
  boardHistoryWithIdx: BoardHistoryWithIdx,
  changeItem: HistoryChangeItem,
): BoardHistoryWithIdx {
  const { boardHistory, historyIdx } = boardHistoryWithIdx;

  const currentHistoryItem = boardHistory[historyIdx];

  if (!currentHistoryItem) {
    console.error("Can't retrieve the current history item.");
    return boardHistoryWithIdx;
  }

  const newHistoryItem = structuredClone(currentHistoryItem);

  switch (changeItem.type) {
    case "categories":
      newHistoryItem.categories = [...changeItem.value];
      break;
    case "cards":
      newHistoryItem.cards = structuredClone(changeItem.value);
      break;
    case "board":
      newHistoryItem.categories = [...changeItem.value.categories];
      newHistoryItem.cards = structuredClone(changeItem.value.cards);
      break;
    default:
      console.error("Unrecognized type of history change item");
  }

  let newHistoryIdx = historyIdx + 1;
  const pastHistory = boardHistory.slice(0, newHistoryIdx);
  let newBoardHistory = [...pastHistory, structuredClone(newHistoryItem)];

  // store only last 10 history actions
  if (newBoardHistory.length > maxHistoryAmount) {
    newBoardHistory = newBoardHistory.slice(-1 * maxHistoryAmount);
    newHistoryIdx = newBoardHistory.length - 1;
  }

  return {
    boardHistory: newBoardHistory,
    historyIdx: newHistoryIdx,
  };
}
