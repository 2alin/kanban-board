import { useState } from "react";

import { parseBoardData } from "../parseBoardData";
import storage from "../storage";

const messageClassNames = {
  none: "",
  error: "error",
  success: "success",
};

export default function Import({ setCategories, setCards }) {
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [messageClassToShow, setMessageClassToShow] = useState(
    messageClassNames.none
  );

  function handleImportFileChange(event) {
    const [file] = event.target.files;
    if (file) {
      setIsFileSelected(true);
    } else {
      setIsFileSelected(false);
    }
  }

  async function handleLoadFileClick() {
    const importFileInput = document.querySelector("#import-file");
    const [file] = importFileInput.files;

    if (!file) {
      console.error("[load-file]: No import file selected");
      setIsFileSelected(false);
      return;
    }

    const textData = await file.text();
    const jsonData = JSON.parse(textData);

    let success = false;
    const oldBoardData = storage.board.get();
    let newBoardData = null;
    try {
      newBoardData = parseBoardData(jsonData);
      storage.board.set(newBoardData);
      setCategories(newBoardData.categories);
      setCards(newBoardData.entries);
      success = true;
    } catch (error) {
      console.error("[load-file]: Error while trying to parse the data", error);
      storage.board.set(oldBoardData);
      setCategories(oldBoardData.categories);
      setCards(oldBoardData.entries);
    }

    // file loading process messages to the user
    if (success) {
      setMessageClassToShow(messageClassNames.success);
    } else {
      setMessageClassToShow(messageClassNames.error);
    }

    // clearing file import section
    importFileInput.value = null;
    setIsFileSelected(false);
    setTimeout(() => {
      setMessageClassToShow(messageClassNames.none);
    }, 3 * 1000);
  }

  return (
    <section id="import-section" className={messageClassToShow}>
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
        hidden={!isFileSelected}
      >
        Load selected data
      </button>
      <span className="success">Board data loaded succcesfully!</span>
      <span className="error">Error while loading board data!</span>
    </section>
  );
}
