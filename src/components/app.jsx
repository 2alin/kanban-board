import { useState } from "react";

import storage from "../storage";
import { getISODate } from "../utilities";

import Board from "./board";
import ExportSection from "./exportSection";
import ImportSection from "./importSection";
import NewCardModal from "./newCardModal";
import ThemeSelector from "./themeSelector";

export default function App({
  initialCategories,
  initialCards,
  handleThemeChange,
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [cards, setCards] = useState(initialCards);
  const [lastChangedBoardData, setLastChangedBoardData] = useState(
    getISODate()
  );

  function storeCards(newCards) {
    const success = storage.board.cards.set(newCards);
    if (success) {
      setCards(newCards);
      setLastChangedBoardData(getISODate());
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
    };

    const newCards = [...cards, newCard];
    storeCards(newCards);
  }

  function updateCard(title, cardData) {
    const cardIndex = cards.findIndex((card) => card.title === title);
    const newCards = [...cards];
    newCards[cardIndex] = cardData;

    storeCards(newCards);
  }

  function deleteCard(title) {
    const newCards = cards.filter((card) => card.title !== title);
    storeCards(newCards);
  }

  function handleNewCardButtonClick() {
    document.body.classList.toggle("new-card", true);
  }

  return (
    <>
      <header>
        <section>
          <button id="new-card-button" onClick={handleNewCardButtonClick}>
            <span className="icon"></span>
          </button>
        </section>
      </header>
      <Board {...{ categories, cards, deleteCard, updateCard }} />
      <NewCardModal {...{ categories, addCard }} />
      <footer>
        <ImportSection {...{ setCategories, setCards }} />
        <ExportSection {...{ lastChangedBoardData }} />
        <ThemeSelector {...{ handleThemeChange }} />
      </footer>
    </>
  );
}
