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
  const { id, title, description, categoryIdx, orderInCategory } = cardData;
  const { deleteCard, updateCard, setModalState } = handlers;

  function handleEdit() {
    setModalState({ type: "edit", cardToEdit: cardData });
    document.body.classList.toggle("show-modal", true);
  }

  function handleDelete() {
    deleteCard(id);
  }

  function handleCategoryChange(newValue: string) {
    const newCategoryIdx = Number(newValue);

    updateCard({
      id,
      title,
      description,
      categoryIdx: newCategoryIdx,
      orderInCategory,
    });
  }

  /**
   * Move the cards position in the category that is located
   *
   * @param direction The direction to move the card.
   * Values accepted: "top", "up", "down", "bottom"
   */
  function moveCard(direction: string) {
    let newOrderInCategory = orderInCategory;

    switch (direction) {
      case "top":
        newOrderInCategory = Number.NEGATIVE_INFINITY;
        break;
      case "up":
        newOrderInCategory = orderInCategory - 1.5;
        break;
      case "down":
        newOrderInCategory = orderInCategory + 1.5;
        break;
      case "bottom":
        newOrderInCategory = Number.POSITIVE_INFINITY;
        break;
      default:
      // handled already in the initialization of this method
    }

    updateCard({
      id,
      title,
      description,
      categoryIdx,
      orderInCategory: newOrderInCategory,
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
          defaultValue={categoryIdx.toString()}
          onChange={handleCategoryChange}
        />
        <div className="buttons middle container">
          <button
            className="move-top icon"
            aria-description="move card to the top"
            onClick={() => moveCard("top")}
          >
            <span className="icon-img"></span>
          </button>
          <button
            className="move-up icon"
            aria-description="move card upwards"
            onClick={() => moveCard("up")}
          >
            <span className="icon-img"></span>
          </button>
          <button
            className="move-down icon"
            aria-description="move card downwards"
            onClick={() => moveCard("down")}
          >
            <span className="icon-img"></span>
          </button>
          <button
            className="move-bottom icon"
            aria-description="move card to the bottom"
            onClick={() => moveCard("bottom")}
          >
            <span className="icon-img"></span>
          </button>
        </div>
        <div className="buttons right container">
          <button
            className="edit icon"
            aria-description="edits card"
            onClick={handleEdit}
          >
            <span className="icon-img"></span>
          </button>
          <button
            className="delete icon"
            aria-description="deletes card"
            onClick={handleDelete}
          >
            <span className="icon-img"></span>
          </button>
        </div>
      </footer>
    </section>
  );
}
