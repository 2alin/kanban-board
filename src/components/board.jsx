import Column from "./column";

export default function Board({ categories, cards, deleteCard, updateCard }) {
  return (
    <section id="board">
      {categories.map((category) => {
        const categoryCards = cards.filter(
          (entry) => entry.category === category
        );

        return (
          <Column
            key={category}
            title={category}
            cards={categoryCards}
            boardCategories={categories}
            {...{ deleteCard, updateCard }}
          />
        );
      })}
    </section>
  );
}
