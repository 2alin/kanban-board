import "./column.css";

import { useContext, useRef, useState } from "react";

import {
  CategoriesContext,
  CategoriesDispatchContext,
} from "../../contexts/categories";

import type { CardExtendedData, ModalState } from "../app.types";
import Card from "../card";
import Menu from "../shared/menu";
import TitleEditForm from "./titleEditForm";
import { CardsContext, CardsDispatchContext } from "../../contexts/cards";

interface ColumnProps {
  columnId: number;
  title: string;
  cards: CardExtendedData[];
  handlers: {
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
  };
}

export default function Column({
  columnId,
  title,
  cards,
  handlers,
}: ColumnProps) {
  const { setModalState } = handlers;

  const [isTitleEdit, setIsTitleEdit] = useState(false);
  const columnRef = useRef<HTMLElement>(null);

  const categories = useContext(CategoriesContext);
  const categoriesDispatch = useContext(CategoriesDispatchContext);

  const boardCards = useContext(CardsContext);
  const cardsDispatch = useContext(CardsDispatchContext);

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
        // positiion is "right" or "left"
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
        categoriesDispatch({ type: "set", categories: newCategories });

        if (newColumnIdx < categories.length && boardCards.length > 0) {
          // we need to move cards of categories that will change
          const newBoardCards: CardExtendedData[] = boardCards.map((card) => {
            const newCard = structuredClone(card);

            if (newCard.categoryIdx >= newColumnIdx) {
              newCard.categoryIdx++;
            }

            return newCard;
          });

          cardsDispatch({ type: "set", cards: newBoardCards });
        }

        break;
      default:
      // nothing to do here
    }
  }

  return (
    <section className="column" ref={columnRef}>
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
            <h2 className="show title">{title}</h2>
            <Menu
              options={[
                {
                  key: "edit-column-name",
                  text: "Edit Column Title",
                  handler: handleMenuClick,
                },
                {
                  key: "add-column-right",
                  text: "Add Column to the Right",
                  handler: handleMenuClick,
                },
                {
                  key: "add-column-left",
                  text: "Add Column to the Left",
                  handler: handleMenuClick,
                },
                {
                  key: "add-card",
                  text: "Add Card",
                  handler: handleMenuClick,
                },
              ]}
              label="Column options menu"
              isIconButton={true}
              positionY="bottom"
              positionX="right"
            />
          </>
        )}
      </header>
      <ol className="card-list">
        {cards.map((card) => (
          <li key={card.id}>
            <Card key={card.id} cardData={card} handlers={{ setModalState }} />
          </li>
        ))}
      </ol>
    </section>
  );
}
