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
}) {
  const sortedCards = cards.toSorted((a, b) => b.categoryIdx - a.categoryIdx);

  return (
    <section className="column" id={getColumnId(title)}>
      <h2 className="title">{title}</h2>
      <ol className="card-list">
        {sortedCards.map((card) => (
          <li key={card.title}>
            <Card
              categoryIdx={card.categoryIdx}
              title={card.title}
              description={card.description}
              category={card.category}
              {...{ boardCategories, deleteCard, updateCard }}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
