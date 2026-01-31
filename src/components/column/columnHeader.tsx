import { useContext, useState } from "react";
import Menu from "../shared/menu";
import TitleEditForm from "./titleEditForm";
import {
  CategoriesContext,
  CategoriesDispatchContext,
} from "../../contexts/categories";
import { CardsContext, CardsDispatchContext } from "../../contexts/cards";
import type {
  CardExtendedData,
  HistoryChangeItem,
  ModalState,
} from "../app.types";
import CounterBadge from "./counterBadge";

interface ColumnHeaderProps {
  title: string;
  headerId: string;
  columnId: number;
  columnRef: React.RefObject<HTMLElement | null>;
  cardsAmount: number;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
  handleHistoryChange: (historyChangeItem: HistoryChangeItem) => void;
}

export default function ColumnHeader({
  title,
  headerId,
  columnId,
  columnRef,
  cardsAmount,
  setModalState,
  handleHistoryChange,
}: ColumnHeaderProps) {
  const categories = useContext(CategoriesContext);
  const categoriesDispatch = useContext(CategoriesDispatchContext);

  const boardCards = useContext(CardsContext);
  const cardsDispatch = useContext(CardsDispatchContext);

  const [isTitleEdit, setIsTitleEdit] = useState(false);

  /**
   * Get the options object needed to create the custom menu
   *
   * @returns An options object
   */
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

  /**
   * Handle Custom Menu click events
   *
   * @param event Menu click event
   * @returns if the event can't be handled
   */
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
              newColumnPosition,
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
            (_, index) => index !== columnId,
          );
          categoriesDispatch({
            type: "set",
            categories: newCategories,
          });

          // removing column cards
          const newCards = boardCards.filter(
            (card) => card.categoryIdx !== columnId,
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

  return (
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
          <CounterBadge amount={cardsAmount} />
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
  );
}
