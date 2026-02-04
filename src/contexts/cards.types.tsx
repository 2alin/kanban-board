import type { CardBaseData, CardExtendedData } from "../app.types";

/**
 * Cards dispatch action to replace all cards
 */
interface SetAction {
  type: "set";
  /**
   * A new set of cards that will replace the current ones
   */
  cards: CardExtendedData[];
  /**
   * Whether the new state of cards should be added to history or not
   */
  addToHistory?: boolean;
}

/**
 * Cards dispatch action to add a new card
 */
interface AddAction {
  type: "add";
  /**
   * The basic information used to create a card
   */
  cardBaseData: CardBaseData;
  /**
   * Whether the new state of cards should be added to history or not
   */
  addToHistory?: boolean;
}

/**
 * Cards dispatch action to update an existing card
 */
interface UpdateAction {
  type: "update";
  /**
   * The full information of a card used to update it
   */
  newCardData: CardExtendedData;
  /**
   * Whether the new state of cards should be added to history or not
   */
  addToHistory?: boolean;
}

/**
 * Cards dispatch action to delete an existing card
 */
interface DeleteAction {
  type: "delete";
  /**
   * The Id of the card to delete
   */
  cardId: string;
  /**
   * Whether the new state of cards should be added to history or not
   */
  addToHistory?: boolean;
}

export type CardsAction = SetAction | AddAction | UpdateAction | DeleteAction;
