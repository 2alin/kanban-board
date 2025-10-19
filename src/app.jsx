import { useState } from "react";
import { Board } from "./board";
import storage from "./storage";
import NewCardModal from "./newCardModal";
import { parseBoardData } from "./parseBoardData";
import { validThemes } from "./defaultSettings";

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
  const [fileToLoad, setFileToLoad] = useState(null);

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

  function handleImportFileChange(event) {
    const importFileInput = event.target;
    const [file] = importFileInput.files;
    setFileToLoad(file);
  }

  async function handleLoadFileClick() {
    if (!fileToLoad) {
      console.error("[load-file]: No import file selected");
      return;
    }

    const textData = await fileToLoad.text();
    const jsonData = JSON.parse(textData);

    let success = false;
    const oldBoardData = localStorage.board.get();
    let newBoardData = null;
    try {
      newBoardData = parseBoardData(jsonData);
      localStorage.board.set(newBoardData);
      setCategories(newBoardData.categories);
      setCards(newBoardData.entries);
      success = true;
    } catch (error) {
      console.error("[load-file]: Error while trying to parse the data");
      console.error(error);
      localStorage.board.set(oldBoardData);
      setCategories(oldBoardData.categories);
      setCards(oldBoardData.entries);
    }

    // clearing file import section
    const importFileInput = document.querySelector("#import-file");
    importFileInput.value = null;
    setFileToLoad(null);
    const importSection = document.querySelector("footer .import");
    if (success) {
      importSection.classList.toggle("success", true);
      // board will update we need to change elements from previous board data
      setDownloadUrl("");
    } else {
      importSection.classList.toggle("error", true);
    }
    // success & error messages are only temporally visible
    setTimeout(() => {
      importSection.classList.toggle("success", false);
      importSection.classList.toggle("error", false);
    }, 3 * 1000);
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
        <section className="import">
          <span>Import board data: </span>
          <input
            type="file"
            name="import-file"
            id="import-file"
            onChange={handleImportFileChange}
          />
          <button
            id="load-selected-button"
            onClick={handleLoadFileClick}
            hidden={fileToLoad === null}
          >
            Load selected data
          </button>
          <span className="success">Board data loaded succcesfully!</span>
          <span className="error">Error while loading board data!</span>
        </section>
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
