import Card from "./card";
import type { CardExtendedData, CardListState, ModalState } from "./app.types";

interface ColumnProps {
  title: string;
  cards: CardListState;
  boardCategories: string[];
  handlers: {
    deleteCard: (id: string) => void;
    updateCard: (cardData: CardExtendedData) => void;
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
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
