import { useContext } from "react";

import { CardsDispatchContext } from "../contexts/cards";
import { CategoriesDispatchContext } from "../contexts/categories";

import type { BoardHistory, BoardHistoryItem } from "./app.types";

interface HistoryControlsProps {
  boardHistory: BoardHistory;
  historyIdx: number;
  handlers: {
    setHistoryIdx: (newHistoryIdx: number) => void;
  };
}

export function HistoryControls({
  boardHistory,
  historyIdx,
  handlers,
}: HistoryControlsProps) {
  const { setHistoryIdx } = handlers;

  const categoriesDispatch = useContext(CategoriesDispatchContext);
  const cardsDispatch = useContext(CardsDispatchContext);

  /**
   * Brings back the state of the board to a previous state in history
   */
  function undoBoardState() {
    if (historyIdx <= 0) {
      console.error(
        "Undo action can't be done. There's no previous board data stored"
      );
      return;
    }

    const newHistoryIdx = historyIdx - 1;
    const historyItemToSet = boardHistory[newHistoryIdx];

    setBoardState(historyItemToSet);
    setHistoryIdx(newHistoryIdx);
  }

  /**
   * Brings forth the state of the board to the next state in history
   */
  function redoBoardState() {
    if (historyIdx >= boardHistory.length - 1) {
      console.error(
        "Redo action can't be done. There's no next board data stored"
      );
      return;
    }

    const newHistoryIdx = historyIdx + 1;
    const historyItemToSet = structuredClone(boardHistory[newHistoryIdx]);

    setBoardState(historyItemToSet);
    setHistoryIdx(newHistoryIdx);
  }

  /**
   * Updates the state of the baord to a given state in history
   *
   * @param historyItem
   */
  function setBoardState(historyItem: BoardHistoryItem) {
    const categoriesToSet = structuredClone(historyItem.categories);
    const cardsToSet = structuredClone(historyItem.cards);

    categoriesDispatch({
      type: "set",
      categories: categoriesToSet,
      addToHistory: false,
    });
    cardsDispatch({
      type: "set",
      cards: cardsToSet,
      addToHistory: false,
    });
  }

  return (
    <div className="history-controls">
      <button
        className="undo icon"
        aria-description="Undo board history"
        onClick={undoBoardState}
        disabled={historyIdx <= 0}
      >
        <span className="icon-img"></span>
      </button>
      <button
        className="redo icon"
        aria-description="Redo board history"
        onClick={redoBoardState}
        disabled={historyIdx >= boardHistory.length - 1}
      >
        <span className="icon-img"></span>
      </button>
    </div>
  );
}
