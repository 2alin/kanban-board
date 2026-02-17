import "./app.css";

import { useState } from "react";

import type { CardExtendedData, CategoryData, ModalState } from "./app.types";

import { CardsProvider } from "./contexts/cards";
import { CategoriesProvider } from "./contexts/categories";

import Board from "./components/board";
import CardModal from "./components/cardModal";
import ExportField from "./components/exportField";
import { HistoryControls } from "./components/historyControls";
import NewCardButton from "./components/shared/newCardButton";
import ImportField from "./components/importField";
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
            <NewCardButton
              label="Add new card in board"
              {...{ setModalState }}
            />
            <HistoryControls />
          </header>

          <Board
            {...{
              setModalState,
              setLastChangedBoard,
            }}
          />

          <footer id="main-footer">
            <section className="board-data">
              <h2>Board data</h2>
              <div className="section-content">
                <ImportField />
                <ExportField lastChangedBoard={lastChangedBoard} />
              </div>
            </section>
            <section>
              <h2>Color Theme</h2>
              <div className="section-content">
                <ThemeSelector {...{ handleThemeChange }} />
              </div>
            </section>
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
