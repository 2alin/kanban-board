import "./column.css";

import {
  useContext,
  useId,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  CardDragState,
  CardExtendedData,
  ModalState,
} from "../../app.types";
import { CardsDispatchContext } from "../../contexts/cards";
import ColumnHeader from "./columnHeader";
import CardsList from "./cardsList";
import NewCardButton from "../shared/newCardButton";

interface ColumnProps {
  columnId: number;
  title: string;
  isCollapsed: boolean;
  cards: CardExtendedData[];
  cardDragState: CardDragState;
  setCardDragState: Dispatch<SetStateAction<CardDragState>>;
  setModalState: Dispatch<SetStateAction<ModalState>>;
}

export default function Column({
  columnId,
  title,
  isCollapsed,
  cards,
  cardDragState,
  setCardDragState,
  setModalState,
}: ColumnProps) {
  const cardsDispatch = useContext(CardsDispatchContext);

  const columnRef = useRef<HTMLElement>(null);
  const headerId = useId();

  function handleDragOver(event: React.DragEvent<HTMLElement>) {
    if (!cardDragState) {
      return;
    }
    if (!event.dataTransfer.types.includes("card_id")) {
      setCardDragState(null);
      return;
    }

    event.preventDefault();

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

    setCardDragState({
      card: cardDragState.card,
      newCategoryIdx: columnId,
      newOrderInCategory: placeholderPosition,
    });
  }

  function handleDropEvent() {
    if (!cardDragState) {
      return;
    }

    const { card, newCategoryIdx, newOrderInCategory } = cardDragState;

    const isNewPosition =
      card.categoryIdx !== newCategoryIdx ||
      (card.orderInCategory !== newOrderInCategory &&
        card.orderInCategory !== newOrderInCategory - 1);

    if (!isNewPosition) {
      setCardDragState(null);
      return;
    }

    cardsDispatch({
      type: "update",
      newCardData: {
        ...card,
        categoryIdx: newCategoryIdx,
        orderInCategory: newOrderInCategory - 0.5,
      },
      addToHistory: true,
    });
    setCardDragState(null);
  }

  return (
    <section
      className={`column ${isCollapsed && "collapsed"}`}
      ref={columnRef}
      aria-labelledby={headerId}
      onDragOver={handleDragOver}
      onDrop={handleDropEvent}
      onDragEnd={() => {
        setCardDragState(null);
      }}
    >
      <ColumnHeader
        {...{
          title,
          headerId,
          columnId,
          columnRef,
          isCollapsed,
          setModalState,
        }}
        cardsAmount={cards.length}
      />
      <CardsList
        {...{ cards, columnId, cardDragState, setCardDragState, setModalState }}
      />
      <footer>
        <NewCardButton
          label="Add new card in column"
          categoryIdx={columnId}
          {...{ setModalState }}
        />
      </footer>
    </section>
  );
}
