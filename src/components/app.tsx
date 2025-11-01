import { useState } from "react";

import storage from "../storage";
import { getISODate, getRandomId } from "../utilities";

import type {
  CardBaseData,
  CardExtendedData,
  CardsMap,
  ModalState,
} from "./app.types";
import Board from "./board";
import ExportSection from "./exportSection";
import ImportSection from "./importSection";
import CardModal from "./cardModal";
import ThemeSelector from "./themeSelector";
import NewCardButton from "./newCardButton";
import { HistoryContros } from "./historyControls";

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
    (a, b) => a.orderInCategory - b.orderInCategory
  );
  const normalizedCards = sortedCards.map((card, index) => ({
    ...card,
    orderInCategory: index,
  }));

  return normalizedCards;
}

/**
 *  Converts an array of cards into a map of cards per category index
 *
 * @param cards The array of cards to convert
 * @param categories The categories that will become the keys of the map
 * @returns A map of cards per category index
 */
export function toCardsMap(
  cards: CardExtendedData[],
  categories: string[]
): CardsMap {
  const cardsByCategory: CardsMap = new Map();
  categories.forEach((category, index) => {
    let cardsInCategory = cards.filter(
      (card) => category === categories[card.categoryIdx]
    );

    cardsInCategory = normalizeCards(cardsInCategory);
    cardsByCategory.set(index, cardsInCategory);
  });

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

interface AppProps {
  initialCategories: string[];
  initialCards: CardExtendedData[];
  handleThemeChange: React.MouseEventHandler;
}

export default function App({
  initialCategories,
  initialCards,
  handleThemeChange,
}: AppProps) {
  const intialModalState: ModalState = { type: "new" };
  const [modalState, setModalState] = useState(intialModalState);

  const initialCardsMap = toCardsMap(initialCards, initialCategories);
  const [cardsMap, setCardsMap] = useState(initialCardsMap);
  const [boardCategories, setBoardCategories] = useState(initialCategories);

  const cloneCardsMap = structuredClone(cardsMap);
  const [boardHistory, setBoardHistory] = useState([cloneCardsMap]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const [lastChangedBoard, setLastChangedBoard] = useState(getISODate());

  /**
   * Updates all data related to be board:
   * - local storage
   * - memory state
   * - last update state
   *
   * @param newCardsMap The new cards map assigned to the board
   * @param rewriteHistory Whether we should rewrite history or not.
   *                       Used in undo/redo actions
   */
  function updateBoardData(newCardsMap: CardsMap, rewriteHistory = true) {
    const newCardList = toCardList(newCardsMap);
    const success = storage.board.entries.set(newCardList);
    if (success) {
      // set default modal state to avoid using data of cards
      // that are not part of the board anymore
      setModalState({ type: "new" });

      setCardsMap(newCardsMap);

      if (rewriteHistory) {
        const newHistoryIdx = historyIdx + 1;
        const pastHistory = boardHistory.slice(0, newHistoryIdx);
        const cloneNewsCardMap = structuredClone(newCardsMap);
        let newBoardHistory = [...pastHistory, cloneNewsCardMap];
        // store only last 10 history actions
        newBoardHistory = newBoardHistory.slice(-10);
        setBoardHistory(newBoardHistory);
        setHistoryIdx(newHistoryIdx);
      }

      setLastChangedBoard(getISODate());
    } else {
      throw new Error("Issue storing cards locally");
    }
  }

  /**
   * Adds a new card in the board
   *
   * @param cardData The card base data to be added
   */
  function addCard(cardData: CardBaseData) {
    let categoryIdx = cardData.categoryIdx;
    if (categoryIdx < 0 || categoryIdx >= boardCategories.length) {
      categoryIdx = 0;
    }

    const cardsInCategory = cardsMap.get(categoryIdx) || [];

    // the new card should be added to the bottom of the list
    const orderInCategory = cardsInCategory.length;
    const newCard = {
      orderInCategory,
      title: cardData.title,
      description: cardData.description,
      categoryIdx,
      id: getRandomId(),
    };

    let newCardsInCategory = [...cardsInCategory, newCard];
    newCardsInCategory = normalizeCards(newCardsInCategory);
    const newCardsMap = new Map(cardsMap);
    newCardsMap.set(categoryIdx, newCardsInCategory);

    updateBoardData(newCardsMap);
  }

  /**
   * Updates a card in the board with the data given
   *
   * @param cardData The data to use to update a card
   */
  function updateCard(cardData: CardExtendedData) {
    let oldCategoryCardList: CardExtendedData[] = [];
    let oldCategoryIdx = -1;

    cardsMap.forEach((cardsInCategory, categoryIdx) => {
      if (cardsInCategory.find((card) => card.id === cardData.id)) {
        oldCategoryCardList = [...cardsInCategory];
        oldCategoryIdx = categoryIdx;
      }
    });

    if (oldCategoryIdx < 0) {
      console.error("Card to update not found in the board");
      return null;
    }

    const newCardsMap = new Map(cardsMap);
    const newCategoryIdx = cardData.categoryIdx;

    if (oldCategoryIdx !== newCategoryIdx) {
      // updating new category list and sending card to the end of it
      const newCategoryCardList = cardsMap.get(newCategoryIdx) || [];
      const orderInCategory = newCategoryCardList.length;
      newCategoryCardList.push({
        ...cardData,
        orderInCategory,
      });

      // removing from old category list
      oldCategoryCardList = oldCategoryCardList.filter(
        (card) => card.id !== cardData.id
      );
      // only the category where the card was removed needs to be normalized
      oldCategoryCardList = normalizeCards(oldCategoryCardList);

      // updating cards map with the new category lists
      newCardsMap.set(newCategoryIdx, newCategoryCardList);
      newCardsMap.set(oldCategoryIdx, oldCategoryCardList);
    } else {
      // card stays in the same category
      oldCategoryCardList = oldCategoryCardList.map((card) =>
        card.id === cardData.id ? cardData : card
      );
      // normalizing as we allow floating numbers to change position in a card
      oldCategoryCardList = normalizeCards(oldCategoryCardList);

      newCardsMap.set(oldCategoryIdx, oldCategoryCardList);
    }

    updateBoardData(newCardsMap);
  }

  /**
   * Deletes a card from the board
   *
   * @param id Id of the card to delete
   */
  function deleteCard(id: string) {
    let newCardsMap = new Map(cardsMap);
    const cardsList = toCardList(cardsMap);
    const card = cardsList.find((card) => card.id === id);

    if (!card) {
      console.error("No card found to delete");
      return;
    }

    const categoryIdx = card.categoryIdx;
    const categoryCardList = cardsMap.get(categoryIdx);

    if (!categoryCardList) {
      console.error(
        "Card wasn't assigned to the right category." +
          "Proceeding to delete card anyway."
      );
      const newCardList = cardsList.filter((card) => card.id !== id);
      newCardsMap = toCardsMap(newCardList, boardCategories);
    } else {
      let newCategoryList = categoryCardList.filter((card) => card.id !== id);
      newCategoryList = normalizeCards(newCategoryList);
      newCardsMap.set(categoryIdx, newCategoryList);
    }

    updateBoardData(newCardsMap);
  }

  return (
    <>
      <header>
        <NewCardButton {...{ setModalState }} />
        <HistoryContros
          {...{ boardHistory, historyIdx }}
          handlers={{ updateBoardData, setHistoryIdx }}
        />
      </header>
      <Board
        {...{ cardsMap, boardCategories }}
        handlers={{ deleteCard, updateCard, setModalState }}
      />
      <CardModal
        {...{ modalState, cardsMap, boardCategories }}
        handlers={{ addCard, updateCard }}
      />
      <footer>
        <ImportSection
          {...{
            setBoardCategories,
            updateBoardData,
          }}
        />
        <ExportSection {...{ lastChangedBoard }} />
        <ThemeSelector {...{ handleThemeChange }} />
      </footer>
    </>
  );
}
