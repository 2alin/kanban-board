import "./card.css";

import { useContext } from "react";

import { CardsDispatchContext } from "../../contexts/cards";
import { CategoriesContext } from "../../contexts/categories";

import type { CardExtendedData, ModalState } from "../app.types";
import CategorySelector from "../shared/categorySelector";
import RichText from "./richText";

interface CardProp {
  cardData: CardExtendedData;
  handlers: {
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
  };
}

export default function Card({ cardData, handlers }: CardProp) {
  const { id, title, description, categoryIdx, orderInCategory } = cardData;
  const { setModalState } = handlers;

  const boardCategories = useContext(CategoriesContext);
  const cardsDispatch = useContext(CardsDispatchContext);

  function handleEdit(event: React.MouseEvent) {
    const { target } = event;

    const origin = target instanceof HTMLElement ? target : undefined;

    setModalState({ type: "edit", cardToEdit: cardData, origin });
  }

  function handleDelete() {
    cardsDispatch({ type: "delete", cardId: id, addToHistory: true });
  }

  function handleCategoryChange(newValue: string) {
    const newCategoryIdx = Number(newValue);

    cardsDispatch({
      type: "update",
      newCardData: {
        id,
        title,
        description,
        categoryIdx: newCategoryIdx,
        orderInCategory,
      },
      addToHistory: true,
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

    cardsDispatch({
      type: "update",
      newCardData: {
        id,
        title,
        description,
        categoryIdx,
        orderInCategory: newOrderInCategory,
      },
      addToHistory: true,
    });
  }

  function handleDragStart(event: React.DragEvent<HTMLElement>) {
    const { target } = event;
    if (!target || !(target instanceof HTMLElement)) {
      return;
    }
    const cardElement = target.closest("section.card");

    if (!cardElement) {
      return;
    }

    event.dataTransfer.effectAllowed = "move";
    // dataTransfer specs are not forcing us to use MIME types,
    // but the type should be lower case, hence using snake case
    // instead of camel case for card id
    event.dataTransfer.setData("card_id", id);

    // creating drag feedback image
    const xOffset = event.clientX - cardElement.getBoundingClientRect().x;
    const yOffset = event.clientY - cardElement.getBoundingClientRect().y;
    event.dataTransfer.setDragImage(cardElement, xOffset, yOffset);
  }

  return (
    <section className="card" data-title={title}>
      <header>
        <h3 className="title">{title}</h3>
        <button
          className="drag icon"
          onDragStart={handleDragStart}
          draggable={true}
          aria-description="drags the card to a new position in the board"
        >
          <span className="icon-img"></span>
        </button>
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
