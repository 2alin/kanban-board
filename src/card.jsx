import { createRoot } from "react-dom/client";

function Card({ title, description, category, boardCategories }) {
  function handleDelete() {
    document.dispatchEvent(
      new CustomEvent("card.delete", { detail: { title } })
    );
  }

  function handleCategoryChange(event) {
    document.dispatchEvent(
      new CustomEvent("card.category.change", {
        detail: { title, newCategory: event.target.value },
      })
    );
  }

  return (
    <section className="card" data-title={title}>
      <header>
        <h3 className="title">{title}</h3>
        <button
          className="delete"
          aria-describedby="deletes card"
          onClick={handleDelete}
        >
          <span className="icon"></span>
        </button>
      </header>
      <p className="description">{description}</p>
      <footer>
        <select
          name="category"
          className="category"
          defaultValue={category}
          onChange={handleCategoryChange}
        >
          {boardCategories.map((boardCategory) => (
            <option key={boardCategory} value={boardCategory}>
              {boardCategory}
            </option>
          ))}
        </select>
      </footer>
    </section>
  );
}

/**
 * Adds a card to the specific column with the data given
 *
 * @param {object} cardData - card data
 * @param {text} columnnId - ID of the column where the card will be added
 * @param {Array[text]} boardCategories - categories defined in the board
 */
export function addCardToColumn(cardData, columnId, boardCategories) {
  const columnElement = document.getElementById(columnId);
  const listElement = columnElement.querySelector(".card-list");

  const listItemElement = document.createElement("li");
  const cardRoot = createRoot(listItemElement);
  cardRoot.render(
    <Card
      title={cardData.title}
      description={cardData.description}
      category={cardData.category}
      boardCategories={boardCategories}
    />
  );

  listElement.appendChild(listItemElement);
}
