import { useContext, useEffect, useState } from "react";

import { CardsContext, toCardsMap } from "../contexts/cards";
import { CategoriesContext } from "../contexts/categories";

import type { CardDragState, HistoryChangeItem, ModalState } from "./app.types";
import Column from "./column";
import { getISODate } from "../utilities";

interface BoardProps {
  handlers: {
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
    setLastChangedBoard: React.Dispatch<React.SetStateAction<string>>;
    handleHistoryChange: (historyChangeItem: HistoryChangeItem) => void;
  };
}

export default function Board({ handlers }: BoardProps) {
  const { setModalState, setLastChangedBoard, handleHistoryChange } = handlers;

  const [cardDragState, setCardDragState] = useState<CardDragState>(null);

  const categories = useContext(CategoriesContext);
  const cards = useContext(CardsContext);

  useEffect(() => {
    setLastChangedBoard(getISODate());
  }, [categories, cards]);

  return (
    <main id="board">
      {categories.map((category, index) => {
        const cardsMap = toCardsMap(cards);
        const cardsInCategory = cardsMap.get(index) || [];

        return (
          <Column
            key={index}
            columnId={index}
            title={category}
            cards={cardsInCategory}
            cardDragState = {cardDragState}
            handlers={{
              setCardDragState,
              setModalState,
              handleHistoryChange,
            }}
          />
        );
      })}
    </main>
  );
}
