import type { CardExtendedData, CardsMap, ModalState } from "./app.types";
import Column from "./column";

interface BoardProps {
  cardsMap: CardsMap;
  boardCategories: string[];
  handlers: {
    deleteCard: (id: string) => void;
    updateCard: (cardData: CardExtendedData) => void;
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
  };
}

export default function Board({
  cardsMap,
  boardCategories,
  handlers,
}: BoardProps) {
  const { deleteCard, updateCard, setModalState } = handlers;

  return (
    <section id="board">
      {boardCategories.map((category, index) => {
        const cardsInCategory = cardsMap.get(index) || [];

        return (
          <Column
            key={index}
            title={category}
            cards={cardsInCategory}
            boardCategories={boardCategories}
            handlers={{ deleteCard, updateCard, setModalState }}
          />
        );
      })}
    </section>
  );
}
