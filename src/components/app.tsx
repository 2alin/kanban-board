import "./app.css";

import { useState } from "react";

import type {
  BoardHistory,
  BoardHistoryItem,
  CardExtendedData,
  HistoryChangeItem,
  ModalState,
} from "./app.types";

import { CardsProvider } from "../contexts/cards";
import { CategoriesProvider } from "../contexts/categories";

import Board from "./board";
import CardModal from "./cardModal";
import ExportSection from "./exportSection";
import { HistoryControls } from "./historyControls";
import NewCardButton from "./newCardButton";
import ImportSection from "./importSection";
import ThemeSelector from "./themeSelector";

interface AppProps {
  initialCategories: string[];
  initialCards: CardExtendedData[];
  handleThemeChange: React.MouseEventHandler;
}

export default function App({
  initialCategories,
  initialCards,
  handleThemeChange,
}: AppProps) {
  const [modalState, setModalState] = useState<ModalState>(null);

  const [lastChangedBoard, setLastChangedBoard] = useState("");

  const initialHistoryItem: BoardHistoryItem = {
    categories: [...initialCategories],
    cards: structuredClone(initialCards),
  };
  const [boardHistory, setBoardHistory] = useState<BoardHistory>([
    initialHistoryItem,
  ]);
  const [historyIdx, setHistoryIdx] = useState(0);

  /**
   * Adds board changes to the history
   *
   * @param historyChangeItem A board history change
   */
  function handleHistoryChange(historyChangeItem: HistoryChangeItem) {
    if (!historyChangeItem) {
      return;
    }

    const newHistoryItem = structuredClone(boardHistory[historyIdx]);
    if (!newHistoryItem) {
      return;
    }

    switch (historyChangeItem.type) {
      case "categories":
        newHistoryItem.categories = [...historyChangeItem.value];
        break;
      case "cards":
        newHistoryItem.cards = structuredClone(historyChangeItem.value);
        break;
      case "board":
        newHistoryItem.categories = [...historyChangeItem.value.categories];
        newHistoryItem.cards = structuredClone(historyChangeItem.value.cards);
        break;
      default:
        console.error("Unrecognized type of history change item");
    }

    const newHistoryIdx = historyIdx + 1;
    const pastHistory = boardHistory.slice(0, newHistoryIdx);
    let newBoardHistory = [...pastHistory, structuredClone(newHistoryItem)];
    // store only last 10 history actions
    newBoardHistory = newBoardHistory.slice(-10);
    setBoardHistory(newBoardHistory);
    setHistoryIdx(newHistoryIdx);
  }

  return (
    <CategoriesProvider
      initialCategories={initialCategories}
      handleHistoryChange={handleHistoryChange}
    >
      <CardsProvider
        initialCards={initialCards}
        handleHistoryChange={handleHistoryChange}
      >
        <header>
          <NewCardButton {...{ setModalState }} />
          <HistoryControls
            {...{ boardHistory, historyIdx }}
            handlers={{ setHistoryIdx }}
          />
        </header>

        <Board
          handlers={{ setModalState, setLastChangedBoard, handleHistoryChange }}
        />

        <footer id="main-footer">
          <ImportSection handleHistoryChange={handleHistoryChange} />
          <ExportSection lastChangedBoard={lastChangedBoard} />
          <ThemeSelector {...{ handleThemeChange }} />
        </footer>

        {modalState && (
          <CardModal
            key={
              modalState.type === "edit"
                ? modalState.cardToEdit.id
                : modalState.type
            }
            {...{ modalState, setModalState }}
          />
        )}
      </CardsProvider>
    </CategoriesProvider>
  );
}
