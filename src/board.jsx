import { createRoot } from "react-dom/client";
import Column from "./column";

let boardRoot = null;

function Board({ categories, entries }) {
  return (
    // TODO: replace this fragment by a section with "board" id
    // once we've moved up with react components
    <>
      {categories.map((category) => {
        const cards = entries.filter((entry) => entry.category === category);

        return (
          <Column
            key={category}
            title={category}
            cards={cards}
            boardCategories={categories}
          />
        );
      })}
    </>
  );
}

export function renderBoard({ categories, entries }) {
  boardRoot.render(<Board categories={categories} entries={entries} />);
}

export function initialize() {
  const boardElement = document.getElementById("board");
  boardRoot = createRoot(boardElement); 
}
