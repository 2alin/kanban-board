import { createContext, useContext, useEffect, useReducer } from "react";

import type {
  CardBaseData,
  CardExtendedData,
  CardsMap,
  HistoryChangeItem,
} from "../components/app.types";
import type { CardsAction } from "./cards.types";
import { getRandomId } from "../utilities";
import storage from "../storage";
import { HistoryDispatchContext } from "./history";
import type { HistoryAction } from "./history.types";

export const CardsContext = createContext<CardExtendedData[]>([]);
export const CardsDispatchContext = createContext<
  React.ActionDispatch<[action: CardsAction]>
>(() => {});

interface CardsProviderProps {
  initialCards: CardExtendedData[];
}

export function CardsProvider({
  initialCards,
  children,
}: React.PropsWithChildren<CardsProviderProps>) {
  const historyDispatch = useContext(HistoryDispatchContext);

  const [cards, dispatch] = useReducer(
    (cards, action) => cardsReducer(cards, action, historyDispatch),
    initialCards,
  );

  useEffect(() => {
    storage.board.entries.set(cards);
  }, [cards]);

  return (
    <CardsContext value={cards}>
      <CardsDispatchContext value={dispatch}>{children}</CardsDispatchContext>
    </CardsContext>
  );
}

/**
 * Handles actions on board cards
 *
 * @param cards The current list of cards
 * @param action The action to execute
 * @param historyDispatch Handler history change actions
 * @returns The new categories after the action executed
 */
function cardsReducer(
  cards: CardExtendedData[],
  action: CardsAction,
  historyDispatch: React.ActionDispatch<[action: HistoryAction]>,
): CardExtendedData[] {
  let newCards: CardExtendedData[] = [];

  switch (action.type) {
    case "set":
      newCards = [...action.cards];
      break;
    case "add":
      newCards = addCard(cards, action.cardBaseData);
      break;
    case "update":
      newCards = updateCard(cards, action.newCardData);
      break;
    case "delete":
      newCards = deleteCard(cards, action.cardId);
      break;
    default:
      newCards = structuredClone(cards);
  }

  const { addToHistory } = action;
  if (addToHistory) {
    const changeItem: HistoryChangeItem = {
      type: "cards",
      value: structuredClone(newCards),
    };
    // Update history after context render
    setTimeout(() => historyDispatch({ type: "add", changeItem }), 0);
  }

  return newCards;
}

/**
 * Adds a new card to a list of given card
 *
 * @param cards A list of cards
 * @param cardBaseData The base data of the new card
 * @returns A list of cards with the new one added
 */

function addCard(
  cards: CardExtendedData[],
  cardBaseData: CardBaseData,
): CardExtendedData[] {
  const cardsMap = toCardsMap(cards);

  let { categoryIdx } = cardBaseData;
  if (categoryIdx < 0) {
    categoryIdx = 0;
  }

  const cardsInCategory = cardsMap.get(categoryIdx) || [];

  // the new card should be added to the bottom of the list
  const orderInCategory = cardsInCategory.length;
  const newCard = {
    orderInCategory,
    title: cardBaseData.title,
    description: cardBaseData.description,
    categoryIdx,
    id: getRandomId(),
  };

  let newCardsInCategory = [...cardsInCategory, newCard];
  newCardsInCategory = normalizeCards(newCardsInCategory);
  const normalizedNewCard = newCardsInCategory.find(
    (card) => card.id === newCard.id,
  );

  if (!normalizedNewCard) {
    console.error("[card.add] Couldn't add the new card", cardBaseData);
    return [...cards];
  }

  return [...cards, normalizedNewCard];
}

/**
 * Updates a card with the new data given
 *
 * @param cards A list of cards from where a card should be updated
 * @param newCardData The new data for the card to update
 * @returns A list of cards with the card updated
 */
export function updateCard(
  cards: CardExtendedData[],
  newCardData: CardExtendedData,
): CardExtendedData[] {
  let oldCategoryCardList: CardExtendedData[] = [];
  let oldCategoryIdx = -1;
  const cardsMap = toCardsMap(cards);

  cardsMap.forEach((cardsInCategory, categoryIdx) => {
    if (cardsInCategory.find((card) => card.id === newCardData.id)) {
      oldCategoryCardList = [...cardsInCategory];
      oldCategoryIdx = categoryIdx;
    }
  });

  if (oldCategoryIdx < 0) {
    console.error("Card to update not found in the board");
    return [...cards];
  }

  const newCardsMap = new Map(cardsMap);
  const newCategoryIdx = newCardData.categoryIdx;

  if (oldCategoryIdx !== newCategoryIdx) {
    // updating new category list and sending card to the end of it,
    // adjustment of card position in the new category will happen
    // on 'normalization' later on
    let newCategoryCardList = cardsMap.get(newCategoryIdx) || [];
    newCategoryCardList.push({
      ...newCardData,
    });

    // removing from old category list
    oldCategoryCardList = oldCategoryCardList.filter(
      (card) => card.id !== newCardData.id,
    );

    // normalizing old and new category lists
    newCategoryCardList = normalizeCards(newCategoryCardList);
    oldCategoryCardList = normalizeCards(oldCategoryCardList);

    // updating cards map with the new category lists
    newCardsMap.set(newCategoryIdx, newCategoryCardList);
    newCardsMap.set(oldCategoryIdx, oldCategoryCardList);
  } else {
    // card stays in the same category
    oldCategoryCardList = oldCategoryCardList.map((card) =>
      card.id === newCardData.id ? newCardData : card,
    );
    // normalizing as we allow floating numbers to change position in a card
    oldCategoryCardList = normalizeCards(oldCategoryCardList);

    newCardsMap.set(oldCategoryIdx, oldCategoryCardList);
  }

  return [...toCardList(newCardsMap)];
}

/**
 * Deletes a card from a list of cards given
 *
 * @param cards A list of cards given from where a card will be deleted
 * @param id Id of the card to delete
 * @returns A list of cards with the card given removed
 */
function deleteCard(cards: CardExtendedData[], id: string): CardExtendedData[] {
  const card = cards.find((card) => card.id === id);

  if (!card) {
    console.error("No card found to delete");
    return cards;
  }

  const cardsMap = toCardsMap(cards);
  const categoryIdx = card.categoryIdx;
  const categoryCardList = cardsMap.get(categoryIdx);
  let newCardsList: CardExtendedData[] = [];

  if (!categoryCardList) {
    console.error(
      "Card wasn't assigned to the right category." +
        "Proceeding to delete card anyway.",
    );
    newCardsList = cards.filter((card) => card.id !== id);
  } else {
    let newCategoryList = categoryCardList.filter((card) => card.id !== id);
    newCategoryList = normalizeCards(newCategoryList);
    cardsMap.set(categoryIdx, newCategoryList);
    newCardsList = toCardList(cardsMap);
  }

  return newCardsList;
}

/**
 * Converts an array of cards into a map of cards per category index
 *
 * @param cardList The array of cards to convert
 * @returns A map of cards per category index
 */
export function toCardsMap(cardList: CardExtendedData[]): CardsMap {
  const cardsByCategory: CardsMap = new Map();

  for (const card of cardList) {
    const cardsInCategory = cardsByCategory.get(card.categoryIdx) || [];
    cardsInCategory.push(card);
    cardsByCategory.set(card.categoryIdx, cardsInCategory);
  }

  for (const [categoryIdx, cardsInCategory] of cardsByCategory.entries()) {
    cardsByCategory.set(categoryIdx, normalizeCards(cardsInCategory));
  }

  return cardsByCategory;
}

/**
 * Converts an map of cards to an array of cards
 *
 * @param cardsMap A map fo cards per category
 * @returns An array of cards
 */
export function toCardList(cardsMap: CardsMap): CardExtendedData[] {
  const cardList: CardExtendedData[] = [];

  cardsMap.forEach((cardListInCategory) => {
    cardList.push(...cardListInCategory);
  });

  return cardList;
}

/**
 * Normalizes a list of cards in the following sense:
 * - sorts the list in ascending order through their `orderInCategory` value
 * - updates the `orderInCategory` value to match the position in the sorted array,
 *   starting with 0
 *
 * @param cards A list of cards to normalize
 * @returns A new list of cards
 */
export function normalizeCards(cards: CardExtendedData[]) {
  const sortedCards = [...cards].sort(
    (a, b) => a.orderInCategory - b.orderInCategory,
  );
  const normalizedCards = sortedCards.map((card, index) => ({
    ...card,
    orderInCategory: index,
  }));

  return normalizedCards;
}
