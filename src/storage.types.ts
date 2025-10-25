/**
 * Persistant Card data
 */
export interface CardEntry {
  /**
   * Board column where the card belongs
   */
  category: string;
  /**
   * Title of the card
   */
  title: string;
  /**
   * Description of the card
   */
  description?: string;
  /**
   * The order where the card will appear in the board column
   */
  categoryIdx: number;
}

/**
 * Persistant board data
 */
export interface BoardData {
  /**
   * names that will be assigned to board columns
   */
  categories: string[];
  /**
   * data that will be used to populate the cards
   */
  entries: CardEntry[];
  /**
   * board storage version
   */
  version: string;
}
