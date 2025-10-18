import { createRoot } from "react-dom/client";
import Column from "./column";

let boardRoot = null;

export function Board({ categories, cards, deleteCard, updateCard }) {
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

export function renderBoard({ categories, entries }) {
  boardRoot.render(<Board {...{ categories, entries }} />);
}

export function initialize() {
  const boardElement = document.getElementById("board");
  boardRoot = createRoot(boardElement);
}
