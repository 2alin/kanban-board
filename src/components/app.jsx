import { useState } from "react";

import { validThemes } from "../defaultSettings";
import storage from "../storage";

import Board from "./board";
import Import from "./import";
import NewCardModal from "./newCardModal";

function getThemeSelector(theme, handleThemeSelection) {
  return (
    <button data-theme={theme} onClick={handleThemeSelection} key={theme}>
      <span className="color-sample"></span>
      <span className="color-sample"></span>
      <span className="color-sample"></span>
      <span className="color-sample"></span>
    </button>
  );
}

export default function App({
  initialCategories,
  initialCards,
  handleThemeSelection,
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [cards, setCards] = useState(initialCards);

  const [downloadUrl, setDownloadUrl] = useState("");

  function storeCards(newCards) {
    const success = storage.board.cards.set(newCards);
    if (success) {
      setCards(newCards);
    } else {
      throw new Error("Issue storing cards locally");
    }

    // board will update we need to change elements from previous board data
    setDownloadUrl("");
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

  function handleExportDataClick() {
    const boardData = storage.board.get();
    const blob = new Blob([JSON.stringify(boardData, null, 2)], {
      type: "application/json",
    });
    const downloadAnchor = document.querySelector("a.download");
    downloadAnchor.href = URL.createObjectURL(blob);
    const dateID = new Date().toISOString();
    downloadAnchor.download = `board-${dateID}.json`;

    setDownloadUrl(downloadAnchor.href);
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
        <Import {...{ setCategories, setCards }} />
        <section className="export">
          <span>Export board data: </span>
          <button id="export-button" onClick={handleExportDataClick}>
            export
          </button>
          <span className="download" hidden={downloadUrl === ""}>
            <span>Your board data is ready to </span>
            <a href="" className="download">
              download
            </a>
          </span>
        </section>
        <section className="theme-selector">
          <span>Theme: </span>
          {validThemes.map((theme) =>
            getThemeSelector(theme, handleThemeSelection)
          )}
        </section>
      </footer>
    </>
  );
}
