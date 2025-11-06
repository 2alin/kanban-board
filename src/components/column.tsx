import { useState } from "react";
import type { CardExtendedData, ModalState } from "./app.types";
import Card from "./card";
import Menu from "./menu";
import TitleEditForm from "./titleEditForm";

interface ColumnProps {
  columnId: number;
  title: string;
  cards: CardExtendedData[];
  boardCategories: string[];
  handlers: {
    deleteCard: (id: string) => void;
    updateCard: (cardData: CardExtendedData) => void;
    renameColumn: (columnId: number, newName: string) => void;
    setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
  };
}

export default function Column({
  columnId,
  title,
  cards,
  boardCategories,
  handlers,
}: ColumnProps) {
  const { deleteCard, updateCard, renameColumn, setModalState } = handlers;

  const [isTitleEdit, setIsTitleEdit] = useState(false);

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
        setModalState({ type: "new", categoryIdx: columnId });
        document.body.classList.toggle("show-modal", true);
        break;
      default:
      // nothing to do here
    }
  }

  return (
    <section className="column">
      <header>
        {isTitleEdit ? (
          <TitleEditForm
            defaultValue={title}
            handleSubmit={(value) => {
              renameColumn(columnId, value);
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
            <Card
              key={card.id}
              cardData={card}
              boardCategories={boardCategories}
              handlers={{ deleteCard, updateCard, setModalState }}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
