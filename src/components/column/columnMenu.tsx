import { useContext, type Dispatch, type SetStateAction } from "react";
import {
  CategoriesContext,
  CategoriesDispatchContext,
} from "../../contexts/categories";
import { HistoryDispatchContext } from "../../contexts/history";
import Menu, { type Option as MenuOption } from "../shared/menu";
import { CardsContext, CardsDispatchContext } from "../../contexts/cards";
import type { CardExtendedData, ModalState } from "../../app.types";
import type { HistoryChangeItem } from "../../contexts/history.types";

interface ColumnMenuProps {
  columnId: number;
  columnRef: React.RefObject<HTMLElement | null>;
  setIsTitleEdit: Dispatch<SetStateAction<boolean>>;
  setModalState: Dispatch<SetStateAction<ModalState>>;
}

export default function ColumnMenu({
  columnId,
  columnRef,
  setIsTitleEdit,
  setModalState,
}: ColumnMenuProps) {
  const historyDispatch = useContext(HistoryDispatchContext);
  const categories = useContext(CategoriesContext);
  const categoriesDispatch = useContext(CategoriesDispatchContext);
  const boardCards = useContext(CardsContext);
  const cardsDispatch = useContext(CardsDispatchContext);

  /**
   * Get the options object needed to create the custom menu
   *
   * @returns An options object
   */
  function getMenuOptions(): MenuOption[] {
    const baseOptions = [
      {
        key: "collapse-column",
        text: "Minimize column",
      },
      {
        key: "edit-column-name",
        text: "Edit column title",
      },
      {
        key: "add-column-ahead",
        text: "Add column ahead",
      },
      {
        key: "add-column-behind",
        text: "Add column behind",
      },
    ];

    // we shouldn't allow removal columns if there's only one column left
    if (categories.length >= 2) {
      baseOptions.push({
        key: "remove-column",
        text: "Remove column",
      });
    }

    baseOptions.push({
      key: "add-card",
      text: "Add card",
    });

    const options: MenuOption[] = baseOptions.map((option) => ({
      ...option,
      handler: handleMenuClick,
    }));

    return options;
  }

  /**
   * Adds a new column in the position given
   *
   * @param position The position for the new column.
   *        Supported values are "ahead" and "behind"
   */
  function addColumn(position: string) {
    // by default new column position will match old column
    let newColumnIdx: number = columnId;

    if (position === "ahead") {
      newColumnIdx = columnId + 1;
    }

    if (newColumnIdx < 0) {
      // minimum index should be zero
      newColumnIdx = 0;
    } else if (newColumnIdx > categories.length) {
      // maximum index should be a unit increment on the current list of columns
      newColumnIdx = categories.length;
    }

    const newColumnTitle = "New Column";
    const newCategories = structuredClone(categories);
    newCategories.splice(newColumnIdx, 0, {
      title: newColumnTitle,
    });
    categoriesDispatch({
      type: "set",
      categories: newCategories,
    });

    if (newColumnIdx < categories.length && boardCards.length > 0) {
      // updating cards that are affected by column changes
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

      // registering board history changes
      const historyChangeItem: HistoryChangeItem = {
        type: "board",
        value: {
          categories: structuredClone(newCategories),
          cards: structuredClone(newBoardCards),
        },
      };
      historyDispatch({ type: "add", changeItem: historyChangeItem });
    } else {
      // no need to update cards if there was no affected ones
      // but we sill need to register board history changes
      const historyChangeItem: HistoryChangeItem = {
        type: "categories",
        value: structuredClone(newCategories),
      };
      historyDispatch({ type: "add", changeItem: historyChangeItem });
    }
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
      case "collapse-column":
        categoriesDispatch({
          type: "collapse",
          id: columnId,
          value: true,
          addToHistory: true,
        });
        break;
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
      case "add-column-ahead":
      case "add-column-behind":
        // position is "ahead" or "behind"
        const newColumnPosition = key.replace("add-column-", "");
        addColumn(newColumnPosition);
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

          const historyChangeItem: HistoryChangeItem = {
            type: "board",
            value: {
              categories: structuredClone(newCategories),
              cards: structuredClone(newCards),
            },
          };
          historyDispatch({ type: "add", changeItem: historyChangeItem });
        }
        break;
      default:
      // nothing to do here
    }
  }

  return (
    <Menu
      options={getMenuOptions()}
      label="Column options menu"
      isIconButton={true}
      positionY="bottom"
      positionX="right"
      className="column-menu"
    />
  );
}
