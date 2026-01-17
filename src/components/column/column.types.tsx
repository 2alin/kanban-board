/**
 * A card is not being dragged in a column.
 */
type CardDragStateOff = { isDragged: false };
/**
 * A card is being dragged in a column.
 */
type CardDragStateOn = {
  isDragged: true;
  /**
   * Current position in a column where the card is being dragged on.
   */
  position: number;
  /**
   * The drag position is different of the current position of the card.
   */
  isNew: boolean;
};

/**
 * Card drag state in a column
 */
export type cardDragState = CardDragStateOn | CardDragStateOff;
