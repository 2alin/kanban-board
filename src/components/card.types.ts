/**
 * Data required to render a card in the board
 */
export interface CardData {
  /**
   * A unique identifier for the card. Automatically generated.
   */
  id: string;
  /**
   * Title of the card
   */
  title: string;
  /**
   * Content description or body of the card
   */
  description: string;
  /**
   * Category or board column where the card belongs
   */
  category: string;
  /**
   * The order where the card will appear in the board column
   */
  categoryIdx: number;
}
