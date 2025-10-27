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
      {boardCategories.map((category) => {
        const cardsInCategory = cardsMap.get(category) || [];

        return (
          <Column
            key={category}
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
