import "./column.css";

import { useContext, useId, useRef, useState } from "react";

import {
  CategoriesContext,
  CategoriesDispatchContext,
} from "../../contexts/categories";

import type {
  CardExtendedData,
  HistoryChangeItem,
  ModalState,
} from "../app.types";
import Card from "../card";
import Menu from "../shared/menu";
import TitleEditForm from "./titleEditForm";
import { CardsContext, CardsDispatchContext } from "../../contexts/cards";
import type { cardDragState } from "./column.types";

interface ColumnProps {
  columnId: number;
  title: string;
  cards: CardExtendedData[];
  handlers: {
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
    handleHistoryChange: (historyChangeItem: HistoryChangeItem) => void;
  };
}

export default function Column({
  columnId,
  title,
  cards,
  handlers,
}: ColumnProps) {
  const { setModalState, handleHistoryChange } = handlers;

  const [isTitleEdit, setIsTitleEdit] = useState(false);
  const [cardDragState, setCardDragState] = useState<cardDragState>({
    isDragged: false,
  });
  const columnRef = useRef<HTMLElement>(null);
  const headerId = useId();

  const categories = useContext(CategoriesContext);
  const categoriesDispatch = useContext(CategoriesDispatchContext);

  const boardCards = useContext(CardsContext);
  const cardsDispatch = useContext(CardsDispatchContext);

  function getMenuOptions() {
    const options = [
      {
        key: "edit-column-name",
        text: "Edit Column Title",
        handler: handleMenuClick,
      },
      {
        key: "add-column-right",
        text: "Add Column Ahead",
        handler: handleMenuClick,
      },
      {
        key: "add-column-left",
        text: "Add Column Behind",
        handler: handleMenuClick,
      },
      {
        key: "add-card",
        text: "Add Card",
        handler: handleMenuClick,
      },
    ];

    // we shouldn't allow removal columns if there's only one column left
    if (categories.length >= 2) {
      const deleteOption = {
        key: "remove-column",
        text: "Remove Column",
        handler: handleMenuClick,
      };

      options.splice(3, 0, deleteOption);
    }

    return options;
  }

  function handleMenuClick(event: React.MouseEvent) {
    const { target } = event;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const { key } = target.dataset;

    switch (key) {
      case "edit-column-name":
        setIsTitleEdit(true);
        break;
      case "add-card":
        let origin =
          columnRef.current?.querySelector(".menu-component .anchor") ||
          undefined;

        if (!(origin instanceof HTMLElement)) {
          origin = undefined;
        }

        setModalState({
          type: "new",
          categoryIdx: columnId,
          origin,
        });

        break;
      case "add-column-right":
      case "add-column-left":
        {
          // position is "right" or "left"
          const newColumnPosition = key.replace("add-column-", "");
          let newColumnIdx: number;

          if (newColumnPosition === "right") {
            newColumnIdx = columnId + 1;
          } else if (newColumnPosition === "left") {
            newColumnIdx = columnId - 1;
          } else {
            console.error(
              "[add column] Unrecognized new column position: ",
              newColumnPosition
            );
            break;
          }

          if (newColumnIdx < 0) {
            // minimum index should be zero
            newColumnIdx = 0;
          } else if (newColumnIdx > categories.length) {
            // maximum index should be a unit increment on the current list of columns
            newColumnIdx = categories.length;
          }

          const newColumnTitle = "New Column";
          const newCategories = [...categories];
          newCategories.splice(newColumnIdx, 0, newColumnTitle);
          categoriesDispatch({
            type: "set",
            categories: newCategories,
          });

          if (newColumnIdx < categories.length && boardCards.length > 0) {
            // we need to move cards of categories that will change
            const newBoardCards: CardExtendedData[] = boardCards.map((card) => {
              const newCard = structuredClone(card);

              if (newCard.categoryIdx >= newColumnIdx) {
                newCard.categoryIdx++;
              }

              return newCard;
            });

            cardsDispatch({
              type: "set",
              cards: newBoardCards,
            });

            handleHistoryChange({
              type: "board",
              value: {
                categories: structuredClone(newCategories),
                cards: structuredClone(newBoardCards),
              },
            });
          } else {
            handleHistoryChange({
              type: "categories",
              value: structuredClone(newCategories),
            });
          }
        }
        break;
      case "remove-column":
        {
          const newCategories = categories.filter(
            (_, index) => index !== columnId
          );
          categoriesDispatch({
            type: "set",
            categories: newCategories,
          });

          // removing column cards
          const newCards = boardCards.filter(
            (card) => card.categoryIdx !== columnId
          );
          // adjusting column idx for remaining cards
          newCards.forEach((card) => {
            if (card.categoryIdx > columnId) {
              card.categoryIdx--;
            }
          });
          cardsDispatch({ type: "set", cards: newCards });

          handleHistoryChange({
            type: "board",
            value: {
              categories: structuredClone(newCategories),
              cards: structuredClone(newCards),
            },
          });
        }
        break;
      default:
      // nothing to do here
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLElement>) {
    if (event.dataTransfer.types.includes("card_id")) {
      event.preventDefault();
    }

    const cardId = event.dataTransfer.getData("card_id");
    const card = boardCards.find((card) => card.id === cardId);
    if (!card) {
      setCardDragState({ isDragged: false });
      return;
    }

    let placeholderPosition = cards.length;
    const cardElementsInColumn =
      columnRef.current?.querySelectorAll(".card") || [];

    for (const [idx, cardElement] of cardElementsInColumn.entries()) {
      const cardLowestBoundary =
        cardElement.getBoundingClientRect().bottom -
        0.5 * cardElement.getBoundingClientRect().height;

      if (cardLowestBoundary >= event.clientY) {
        placeholderPosition = idx;
        break;
      }
    }

    const isDragNewPosition =
      card.categoryIdx !== columnId ||
      (card.orderInCategory !== placeholderPosition &&
        card.orderInCategory !== placeholderPosition - 1);

    setCardDragState({
      isDragged: true,
      position: placeholderPosition,
      isNew: isDragNewPosition,
    });
  }

  function handleDropEvent(event: React.DragEvent<HTMLElement>) {
    if (!cardDragState.isDragged) {
      return;
    }

    if (!cardDragState.isNew) {
      setCardDragState({ isDragged: false });
      return;
    }

    const cardId = event.dataTransfer.getData("card_id");

    const card = boardCards.find((card) => card.id === cardId);
    if (!card) {
      setCardDragState({ isDragged: false });
      return;
    }

    const newCategoryIdx = columnId;
    const newOrderInCategory = cardDragState.position - 0.5;
    cardsDispatch({
      type: "update",
      newCardData: {
        ...card,
        categoryIdx: newCategoryIdx,
        orderInCategory: newOrderInCategory,
      },
    });
    setCardDragState({ isDragged: false });
  }

  return (
    <section
      className="column"
      ref={columnRef}
      aria-labelledby={headerId}
      onDragOver={handleDragOver}
      onDrop={handleDropEvent}
      onDragLeave={() => setCardDragState({ isDragged: false })}
      onDragEnd={() => setCardDragState({ isDragged: false })}
    >
      <header>
        {isTitleEdit ? (
          <TitleEditForm
            defaultValue={title}
            handleSubmit={(value) => {
              categoriesDispatch({
                type: "rename",
                id: columnId,
                value,
                addToHistory: true,
              });
              setIsTitleEdit(false);
            }}
            handleCancel={() => {
              setIsTitleEdit(false);
            }}
          />
        ) : (
          <>
            <h2 className="show title" id={headerId}>
              {title}
            </h2>
            <Menu
              options={getMenuOptions()}
              label="Column options menu"
              isIconButton={true}
              positionY="bottom"
              positionX="right"
            />
          </>
        )}
      </header>
      {getCardsList(cards, cardDragState, setModalState)}
    </section>
  );
}

function getCardsList(
  cards: CardExtendedData[],
  cardDragState: cardDragState,
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>
) {
  return (
    <ol className="card-list">
      {cards.map((card) => (
        <>
          {cardDragState.isDragged &&
            cardDragState.isNew &&
            cardDragState.position === card.orderInCategory && (
              <li>
                <span className="drop placeholder">Drop card</span>
              </li>
            )}
          <li key={card.id}>
            <Card key={card.id} cardData={card} handlers={{ setModalState }} />
          </li>
        </>
      ))}
      {cardDragState.isDragged &&
        cardDragState.isNew &&
        cardDragState.position === cards.length && (
          <li>
            <span className="drop placeholder"> Drop card</span>
          </li>
        )}
    </ol>
  );
}
