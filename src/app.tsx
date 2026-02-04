import "./app.css";

import { useState } from "react";

import type { CardExtendedData, CategoryData, ModalState } from "./app.types";

import { CardsProvider } from "./contexts/cards";
import { CategoriesProvider } from "./contexts/categories";

import Board from "./components/board";
import CardModal from "./components/cardModal";
import ExportSection from "./components/exportSection";
import { HistoryControls } from "./components/historyControls";
import NewCardButton from "./components/newCardButton";
import ImportSection from "./components/importSection";
import ThemeSelector from "./components/themeSelector";
import { HistoryProvider } from "./contexts/history";
import type {
  BoardHistoryItem,
  BoardHistoryWithIdx,
} from "./contexts/history.types";

interface AppProps {
  initialCategories: CategoryData[];
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

  const initBoardHistoryWithIdx: BoardHistoryWithIdx = {
    boardHistory: [initialHistoryItem],
    historyIdx: 0,
  };

  return (
    <HistoryProvider {...{ initBoardHistoryWithIdx }}>
      <CategoriesProvider {...{ initialCategories }}>
        <CardsProvider {...{ initialCards }}>
          <header>
            <NewCardButton {...{ setModalState }} />
            <HistoryControls />
          </header>

          <Board
            {...{
              setModalState,
              setLastChangedBoard,
            }}
          />

          <footer id="main-footer">
            <ImportSection />
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
    </HistoryProvider>
  );
}
