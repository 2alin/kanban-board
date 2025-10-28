import Card from "./card";
import type { CardExtendedData, ModalState } from "./app.types";

interface ColumnProps {
  title: string;
  cards: CardExtendedData[];
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

  return (
    <section className="column">
      <h2 className="title">{title}</h2>
      <ol className="card-list">
        {cards.map((card) => (
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
