import Column from "./column";

export default function Board({
  categories,
  cards,
  deleteCard,
  updateCard,
  setModalState,
}) {
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
