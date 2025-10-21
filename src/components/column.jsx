import Card from "./card";

/**
 * Gets the column ID in the right format
 *
 * @param {string} name
 * @returns
 */
export function getColumnId(name) {
  return "column-" + name;
}

export default function Column({
  title,
  cards,
  boardCategories,
  deleteCard,
  updateCard,
  setModalState,
}) {
  const sortedCards = cards.toSorted((a, b) => b.categoryIdx - a.categoryIdx);

  return (
    <section className="column" id={getColumnId(title)}>
      <h2 className="title">{title}</h2>
      <ol className="card-list">
        {sortedCards.map((card) => (
          <li key={card.id}>
            <Card
              title={card.title}
              description={card.description}
              category={card.category}
              id={card.id}
              key={card.id}
              {...{ boardCategories, deleteCard, updateCard, setModalState }}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
