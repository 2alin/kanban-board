import { useState } from "react";

import type { CardExtendedData, CardsMap } from "./app.types";
import storage from "../storage";
import { getRandomId } from "../utilities";
import { toCardsMap } from "./app";

const messageClassNames = {
  none: "",
  error: "error",
  success: "success",
};

interface ImportSectionProps {
  setBoardCategories: (categories: string[]) => void;
  updateBoardData: (cardsMap: CardsMap) => void;
}

export default function ImportSection({
  setBoardCategories,
  updateBoardData,
}: ImportSectionProps) {
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [messageClassToShow, setMessageClassToShow] = useState(
    messageClassNames.none
  );

  function handleImportFileChange(event: React.ChangeEvent) {
    const inputFileElement = event.target as HTMLInputElement;

    if (!inputFileElement.files) {
      setIsFileSelected(false);
      return;
    }

    const [file] = inputFileElement.files;
    if (file) {
      setIsFileSelected(true);
    } else {
      setIsFileSelected(false);
    }
  }

  async function handleLoadFileClick() {
    const importFileInput = document.querySelector(
      "#import-file"
    ) as HTMLInputElement;

    if (!importFileInput.files) {
      console.error(
        "[load-file]: No 'files' property found in the input element"
      );
      setIsFileSelected(false);
      return;
    }

    const [file] = importFileInput.files;

    if (!file) {
      console.error("[load-file]: No import file selected");
      setIsFileSelected(false);
      return;
    }

    const textData = await file.text();
    const jsonData = JSON.parse(textData);
    let newBoardData = null;

    const oldBoardData = storage.board.get();
    let isNewBoardDataStored = false;
    try {
      isNewBoardDataStored = storage.board.set(jsonData);
      newBoardData = storage.board.get();
    } catch (error) {
      console.error(
        "[load-file]: Error while trying to import the data",
        error
      );
      storage.board.set(oldBoardData);
    }

    if (isNewBoardDataStored && newBoardData) {
      setBoardCategories(newBoardData.categories);
      const newCardList = newBoardData.entries.map((entry) => {
        return {
          id: getRandomId(),
          title: entry.title,
          description: entry.description || "",
          category: entry.category,
          categoryIdx: entry.categoryIdx,
        };
      });
      const newCardsMap = toCardsMap(newCardList, newBoardData.categories);
      updateBoardData(newCardsMap);
      setMessageClassToShow(messageClassNames.success);
    } else if (oldBoardData) {
      setMessageClassToShow(messageClassNames.error);
    }

    // clearing file import section
    importFileInput.value = "";
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
