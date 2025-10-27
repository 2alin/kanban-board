import Card from "./card";
import type { CardData } from "./card.types";

interface ColumnProps {
  title: string;
  cards: CardData[];
  boardCategories: string[];
  handlers: {
    deleteCard: () => void;
    updateCard: () => void;
    setModalState: () => void;
  };
}

export default function Column({
  title,
  cards,
  boardCategories,
  handlers,
}: ColumnProps) {
  const { deleteCard, updateCard, setModalState } = handlers;

  const sortedCards = [...cards].sort((a, b) => b.categoryIdx - a.categoryIdx);

  return (
    <section className="column">
      <h2 className="title">{title}</h2>
      <ol className="card-list">
        {sortedCards.map((card) => (
          <li key={card.id}>
            <Card
              key={card.id}
              cardData={card}
              boardCategories={boardCategories}
              handlers={{ deleteCard, updateCard, setModalState }}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
