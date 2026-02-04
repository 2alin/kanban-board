import type { CardEntry } from "./storage.types";

/**
 * Persistant board data for storage v0.2
 */
export interface BoardData_v02 {
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
