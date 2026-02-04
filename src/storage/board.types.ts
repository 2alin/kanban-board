/**
 * Persistant Category data
 */
export interface CategoryEntry {
  /**
   * Whether the category is collapsed or not
   */
  isCollapsed: boolean;
  /**
   * Category title
   */
  title: string;
}

/**
 * Persistant Card data
 */
export interface CardEntry {
  /**
   * Index of the board column where the card belongs
   * linked to BoardData.categories
   */
  categoryIdx: number;
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
  orderInCategory: number;
}

/**
 * Persistant board data
 */
export interface BoardData {
  /**
   * names that will be assigned to board columns
   */
  categories: CategoryEntry[];
  /**
   * data that will be used to populate the cards
   */
  entries: CardEntry[];
  /**
   * board storage version
   */
  version: string;
}
