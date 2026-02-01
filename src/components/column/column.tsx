import "./column.css";

import {
  useContext,
  useId,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";

import type { CardDragState, CardExtendedData, ModalState } from "../app.types";
import Card from "../card";
import { CardsDispatchContext } from "../../contexts/cards";
import ColumnHeader from "./columnHeader";

interface ColumnProps {
  columnId: number;
  title: string;
  cards: CardExtendedData[];
  cardDragState: CardDragState;
  setCardDragState: Dispatch<SetStateAction<CardDragState>>;
  setModalState: Dispatch<SetStateAction<ModalState>>;
}

export default function Column({
  columnId,
  title,
  cards,
  cardDragState,
  setCardDragState,
  setModalState,
}: ColumnProps) {
  const columnRef = useRef<HTMLElement>(null);
  const headerId = useId();

  const cardsDispatch = useContext(CardsDispatchContext);

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
      className="column"
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
          setModalState,
        }}
        cardsAmount={cards.length}
      />
      {getCardsList(
        cards,
        columnId,
        cardDragState,
        setCardDragState,
        setModalState,
      )}
    </section>
  );
}

function getCardsList(
  cards: CardExtendedData[],
  columnId: number,
  cardDragState: CardDragState,
  setCardDragState: React.Dispatch<React.SetStateAction<CardDragState>>,
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>,
) {
  let isDragNewPosition = false;

  if (cardDragState) {
    const {
      card: cardDragged,
      newCategoryIdx,
      newOrderInCategory,
    } = cardDragState;

    isDragNewPosition =
      cardDragged.categoryIdx !== newCategoryIdx ||
      (cardDragged.orderInCategory !== newOrderInCategory &&
        cardDragged.orderInCategory !== newOrderInCategory - 1);
  }

  return (
    <ol className="card-list">
      {cards.map((card, idx) => (
        <li key={card.id} style={{ order: idx }}>
          <Card
            key={card.id}
            cardData={card}
            handlers={{ setCardDragState, setModalState }}
          />
        </li>
      ))}
      {cardDragState &&
        cardDragState.newCategoryIdx === columnId &&
        isDragNewPosition && (
          <li
            key={"placeholder"}
            style={{ order: cardDragState.newOrderInCategory - 1 }}
          >
            <span className="drop placeholder"> Drop card</span>
          </li>
        )}
    </ol>
  );
}
