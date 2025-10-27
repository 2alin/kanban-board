import type { CardExtendedData, ModalState } from "./app.types";
import CategorySelector from "./categorySelector";
import RichText from "./richText";

interface CardProp {
  cardData: CardExtendedData;
  boardCategories: string[];
  handlers: {
    deleteCard: (id: string) => void;
    updateCard: (cardData: CardExtendedData) => void;
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
  };
}

export default function Card({
  cardData,
  boardCategories,
  handlers,
}: CardProp) {
  const { id, title, description, category, categoryIdx } = cardData;
  const { deleteCard, updateCard, setModalState } = handlers;

  function handleEdit() {
    setModalState({ type: "edit", cardId: id });
    document.body.classList.toggle("show-modal", true);
  }

  function handleDelete() {
    deleteCard(id);
  }

  function handleCategoryChange(event: React.ChangeEvent) {
    const selectElement = event.target;

    if (!(selectElement instanceof HTMLSelectElement)) {
      console.error("Event target is not a Select element");
      return;
    }

    const newCategory = selectElement.value;

    updateCard({
      id,
      title,
      description,
      category: newCategory,
      categoryIdx,
    });
  }

  return (
    <section className="card" data-title={title}>
      <header>
        <h3 className="title">{title}</h3>
      </header>
      <div className="description">
        <RichText text={description} />
      </div>
      <footer>
        <CategorySelector
          categories={boardCategories}
          defaultSelected={category}
          handleChange={handleCategoryChange}
        />
        <div className="right-container">
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
