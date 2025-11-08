import { useContext } from "react";
import type { CardExtendedData, CardsMap, ModalState } from "./app.types";
import Column from "./column";
import { CategoriesContext } from "./categoriesContext";

interface BoardProps {
  cardsMap: CardsMap;
  handlers: {
    deleteCard: (id: string) => void;
    updateCard: (cardData: CardExtendedData) => void;
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
  };
}

export default function Board({ cardsMap, handlers }: BoardProps) {
  const { deleteCard, updateCard, setModalState } = handlers;

  const categories = useContext(CategoriesContext);

  return (
    <section id="board">
      {categories.map((category, index) => {
        const cardsInCategory = cardsMap.get(index) || [];

        return (
          <Column
            key={index}
            columnId={index}
            title={category}
            cards={cardsInCategory}
            handlers={{
              deleteCard,
              updateCard,
              setModalState,
            }}
          />
        );
      })}
    </section>
  );
}
