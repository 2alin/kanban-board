/**
 * Persistant Card data for storage v0.1
 */
interface CardEntry_V01 {
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
 * Persistant board data for storage v0.1
 */
export interface BoardData_v01 {
  /**
   * names that will be assigned to board columns
   */
  categories: string[];
  /**
   * data that will be used to populate the cards
   */
  entries: CardEntry_V01[];
  /**
   * board storage version
   */
  version: string;
}
