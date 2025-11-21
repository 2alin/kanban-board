import { useContext, useEffect } from "react";

import { CardsContext, toCardsMap } from "../contexts/cards";
import { CategoriesContext } from "../contexts/categories";

import type { ModalState } from "./app.types";
import Column from "./column/column";
import { getISODate } from "../utilities";

interface BoardProps {
  handlers: {
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
    setLastChangedBoard: React.Dispatch<React.SetStateAction<string>>;
  };
}

export default function Board({ handlers }: BoardProps) {
  const { setModalState, setLastChangedBoard } = handlers;

  const categories = useContext(CategoriesContext);
  const cards = useContext(CardsContext);

  useEffect(() => {
    setLastChangedBoard(getISODate());
  }, [categories, cards]);

  return (
    <section id="board">
      {categories.map((category, index) => {
        const cardsMap = toCardsMap(cards);
        const cardsInCategory = cardsMap.get(index) || [];

        return (
          <Column
            key={index}
            columnId={index}
            title={category}
            cards={cardsInCategory}
            handlers={{
              setModalState,
            }}
          />
        );
      })}
    </section>
  );
}
