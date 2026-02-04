import {
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { CardsContext, toCardsMap } from "../contexts/cards";
import { CategoriesContext } from "../contexts/categories";

import type { CardDragState, ModalState } from "../app.types";
import Column from "./column";
import { getISODate } from "../utilities";

interface BoardProps {
  setModalState: Dispatch<SetStateAction<ModalState>>;
  setLastChangedBoard: Dispatch<SetStateAction<string>>;
}

export default function Board({
  setModalState,
  setLastChangedBoard,
}: BoardProps) {
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
            isCollapsed={category.isCollapsed || false}
            title={category.title}
            cards={cardsInCategory}
            {...{ cardDragState, setCardDragState, setModalState }}
          />
        );
      })}
    </main>
  );
}
