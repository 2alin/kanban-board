/**
 * Initial card data needed by the app
 */
export interface CardBaseData {
  /**
   * Title of the card
   */
  title: string;
  /**
   * Description of the card
   */
  description: string;
  /**
   * Index of the board column where the card belongs.
   */
  categoryIdx: number;
}

/**
 * Data required to render a card in the board
 */
export interface CardExtendedData extends CardBaseData {
  /**
   * A unique identifier for the card. Automatically generated.
   */
  id: string;
  /**
   * The order where the card will appear in the board column
   */
  orderInCategory: number;
}

/**
 * A map in memory that holds the cards per category index assigned
 */
export type CardsMap = Map<number, CardExtendedData[]>;

/**
 * Modal used to add a new card.
 */
export interface ModalStateNew {
  type: "new";
  categoryIdx?: number;
  /**
   * Optional value to bring back focus to an element
   * when the modal gets closed
   */
  origin?: HTMLElement;
}

/**
 * Modal used to edit a card.
 */
interface ModalStateEdit {
  type: "edit";
  cardToEdit: CardExtendedData;
  /**
   * Optional value to bring back focus to an element
   * when the modal gets closed
   */
  origin?: HTMLElement;
}

/**
 * The modal state: type and data associated to it.
 */
export type ModalState = ModalStateNew | ModalStateEdit | null;

/**
 * A card is being dragged
 */
type CardDragStateOn = {
  /**
   * The card being dragged
   */
  card: CardExtendedData;
  /**
   * Candidate category where the card can be dropped
   */
  newCategoryIdx: number;
  /**
   * Candidate order in a category where the card can be dropped
   */
  newOrderInCategory: number;
};

/**
 * Indicates if a card is currently being dragged
 */
export type CardDragState = null | CardDragStateOn;
