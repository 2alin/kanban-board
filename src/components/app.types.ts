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
}

/**
 * Modal used to edit a card.
 */
interface ModalStateEdit {
  type: "edit";
  cardToEdit: CardExtendedData;
}

/**
 * The modal state: type and data associated to it.
 */
export type ModalState = ModalStateNew | ModalStateEdit | null;
