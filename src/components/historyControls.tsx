import type { CardsMap } from "./app.types";

interface HistoryControlsProps {
  boardHistory: CardsMap[];
  historyIdx: number;
  handlers: {
    updateBoardData: (newCardsMap: CardsMap, rewriteHistory: boolean) => void;
    setHistoryIdx: (newHistoryIdx: number) => void;
  };
}

export function HistoryControls({
  boardHistory,
  historyIdx,
  handlers,
}: HistoryControlsProps) {
  const { updateBoardData, setHistoryIdx } = handlers;

  /**
   * Brings back the state of the board to a previous state in history
   *
   * @returns
   */
  function undoBoardState() {
    if (historyIdx <= 0) {
      console.error(
        "Undo action can't be done. There's no previous board data stored"
      );
      return;
    }

    const newHistoryIdx = historyIdx - 1;
    const newCardsMap = structuredClone(boardHistory[newHistoryIdx]);
    updateBoardData(newCardsMap, false);
    setHistoryIdx(newHistoryIdx);
  }

  /**
   * Brings forth the state of the board to the next state in history
   *
   * @returns
   */
  function redoBoardState() {
    if (historyIdx >= boardHistory.length - 1) {
      console.error(
        "Redo action can't be done. There's no next board data stored"
      );
      return;
    }

    const newHistoryIdx = historyIdx + 1;
    const newCardsMap = structuredClone(boardHistory[newHistoryIdx]);
    updateBoardData(newCardsMap, false);
    setHistoryIdx(newHistoryIdx);
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
