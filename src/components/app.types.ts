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
   * Board column where the card belongs
   */
  category: string;
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
  categoryIdx: number;
}

/**
 * A map in memory that holds the cards per category assigned
 */
export type CardsMap = Map<string, CardExtendedData[]>;

/**
 * The state of the modal. Valid typesare:
 * - {type: "new"} -- for adding a new card
 * - {type: "edit", cardId: [string]} -- for editing an existing ca
 */
export interface ModalState {
  type: string;
  cardId?: string;
}
