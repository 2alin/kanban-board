/**
 * Data required to render a card in the board
 */
export interface CardData {
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
   * A unique identifier for the card. Automatically generated.
   */
  id: string;
}
