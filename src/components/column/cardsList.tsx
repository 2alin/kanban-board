import type { Dispatch, SetStateAction } from "react";
import type {
  CardDragState,
  CardExtendedData,
  ModalState,
} from "../../app.types";
import Card from "../card";

interface CarsdListProps {
  cards: CardExtendedData[];
  columnId: number;
  cardDragState: CardDragState;
  setCardDragState: Dispatch<SetStateAction<CardDragState>>;
  setModalState: Dispatch<SetStateAction<ModalState>>;
}

export default function CardsList({
  cards,
  columnId,
  cardDragState,
  setCardDragState,
  setModalState,
}: CarsdListProps) {
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
