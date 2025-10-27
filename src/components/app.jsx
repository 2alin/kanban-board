import { useState } from "react";

import storage from "../storage";
import { getISODate, getRandomId } from "../utilities";

import Board from "./board";
import ExportSection from "./exportSection";
import ImportSection from "./importSection";
import CardModal from "./cardModal";
import ThemeSelector from "./themeSelector";
import NewCardButton from "./newCardButton";

export default function App({
  initialCategories,
  initialCards,
  handleThemeChange,
}) {
  /**
   * Valid types of modalState are:
   * - {type: "new"} -- for adding a new card
   * - {type: "edit", cardId: [string]} -- for editing an existing card
   */
  const [modalState, setModalState] = useState({ type: "new" });

  const [categories, setCategories] = useState(initialCategories);
  const [cards, setCards] = useState(initialCards);
  const [lastChangedBoard, setLastChangedBoard] = useState(getISODate());

  function storeCards(newCards) {
    const success = storage.board.entries.set(newCards);
    if (success) {
      // set default modal state to avoid using data of cards
      // that are not part of the board anymore
      setModalState({ type: "new" });

      setCards(newCards);
      setLastChangedBoard(getISODate());
    } else {
      throw new Error("Issue storing cards locally");
    }
  }

  function addCard(cardData) {
    const newCard = {
      categoryIdx: 0,
      title: cardData.title,
      description: cardData.description,
      category: cardData.category,
      id: getRandomId(),
    };

    const newCards = [...cards, newCard];
    storeCards(newCards);
  }

  function replaceCardList(cardListData) {
    const newCards = cardListData.map((cardData) => ({
      categoryIdx: 0,
      title: cardData.title,
      description: cardData.description,
      category: cardData.category,
      id: getRandomId(),
    }));

    storeCards(newCards);
  }

  function updateCard({ id, title, description, category }) {
    const cardIndex = cards.findIndex((card) => card.id === id);

    const updatedCard = cards[cardIndex];
    updatedCard.title = title;
    updatedCard.description = description;
    updatedCard.category = category;

    const newCards = [...cards];
    newCards[cardIndex] = updatedCard;
    storeCards(newCards);
  }

  function deleteCard(id) {
    const newCards = cards.filter((card) => card.id !== id);
    storeCards(newCards);
  }

  return (
    <>
      <header>
        <NewCardButton {...{ setModalState }} />
      </header>
      <Board
        {...{ categories, cards }}
        handlers={{ deleteCard, updateCard, setModalState }}
      />
      <CardModal
        {...{ modalState, categories, cards }}
        handlers={{ addCard, updateCard }}
      />
      <footer>
        <ImportSection {...{ setCategories, replaceCardList }} />
        <ExportSection {...{ lastChangedBoard }} />
        <ThemeSelector {...{ handleThemeChange }} />
      </footer>
    </>
  );
}
