import CategorySelector from "./categorySelector";

export default function Card({
  // card data
  title,
  description,
  category,
  id,
  // board data
  boardCategories,
  // event handlers
  deleteCard,
  updateCard,
  setModalState,
}) {
  function handleEdit() {
    setModalState({ type: "edit", cardId: id });
    document.body.classList.toggle("show-modal", true);
  }

  function handleDelete() {
    deleteCard(id);
  }

  function handleCategoryChange(event) {
    const newCategory = event.target.value;

    updateCard({
      cardId: id,
      newTitle: title,
      newDescription: description,
      newCategory,
    });
  }

  return (
    <section className="card" data-title={title}>
      <header>
        <h3 className="title">{title}</h3>
      </header>
      <p className="description">{description}</p>
      <footer>
        <CategorySelector
          categories={boardCategories}
          defaultSelected={category}
          handleChange={handleCategoryChange}
        />
        <div className="container">
          <button
            className="edit icon"
            aria-describedby="edits card"
            onClick={handleEdit}
          >
            <span className="icon-img"></span>
          </button>
          <button
            className="delete icon"
            aria-describedby="deletes card"
            onClick={handleDelete}
          >
            <span className="icon-img"></span>
          </button>
        </div>
      </footer>
    </section>
  );
}
