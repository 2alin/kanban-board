import type { CardData } from "./card.types";
import Column from "./column";

interface BoardProps {
  categories: string[];
  cards: CardData[];
  handlers: {
    deleteCard: () => void;
    updateCard: () => void;
    setModalState: () => void;
  };
}

export default function Board({ categories, cards, handlers }: BoardProps) {
  const { deleteCard, updateCard, setModalState } = handlers;

  return (
    <section id="board">
      {categories.map((category) => {
        const cardsInCategory = cards.filter(
          (entry) => entry.category === category
        );

        return (
          <Column
            key={category}
            title={category}
            cards={cardsInCategory}
            boardCategories={categories}
            handlers={{ deleteCard, updateCard, setModalState }}
          />
        );
      })}
    </section>
  );
}
