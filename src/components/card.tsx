import type { CardData } from "./card.types";
import CategorySelector from "./categorySelector";
import RichText from "./richText";

interface CardProp {
  cardData: CardData;
  boardCategories: string[];
  handlers: {
    deleteCard: (id: string) => void;
    updateCard: (cardData: CardData) => void;
    setModalState: ({
      type,
      cardId,
    }: {
      type: string;
      cardId?: string;
    }) => void;
  };
}

export default function Card({
  cardData,
  boardCategories,
  handlers,
}: CardProp) {
  const { title, description, category, id } = cardData;
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
