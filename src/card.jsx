export default function Card({
  categoryIdx,
  title,
  description,
  category,
  boardCategories,
  deleteCard,
  updateCard,
}) {
  function handleDelete() {
    deleteCard(title);
  }

  function handleCategoryChange(event) {
    const newCategory = event.target.value;
    updateCard(title, {
      categoryIdx,
      title,
      description,
      category: newCategory,
    });
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
          value={category}
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
