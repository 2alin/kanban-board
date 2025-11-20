import { useContext, useRef, useState } from "react";

import { CategoriesDispatchContext } from "../contexts/categories";

import type { CardExtendedData, ModalState } from "./app.types";
import Card from "./card";
import Menu from "./menu";
import TitleEditForm from "./titleEditForm";

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

  const categoriesDispatch = useContext(CategoriesDispatchContext);

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
        {
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
          document.body.classList.toggle("show-modal", true);
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
                  text: "Edit Title",
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
