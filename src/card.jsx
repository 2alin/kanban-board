export default function Card({
  title,
  description,
  category,
  boardCategories,
}) {
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
