import { useState } from "react";

import storage from "../storage";
import type { CardBaseData } from "./app.types";

const messageClassNames = {
  none: "",
  error: "error",
  success: "success",
};

interface ImportSectionProps {
  setCategories: (categories: string[]) => void;
  replaceCardList: (cardDataList: CardBaseData[]) => void;
}

export default function ImportSection({
  setCategories,
  replaceCardList,
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

    let success = false;
    const oldBoardData = storage.board.get();
    let newBoardData = null;
    try {
      const isBoardDataStored = storage.board.set(jsonData);
      if (!isBoardDataStored) {
        throw new Error("Couldn't store board data");
      }
      newBoardData = storage.board.get();
      success = true;
    } catch (error) {
      console.error("[load-file]: Error while trying to parse the data", error);
      storage.board.set(oldBoardData);
    }

    if (success && newBoardData) {
      setCategories(newBoardData.categories);
      const newCardList = newBoardData.entries.map((entry) => {
        return {
          title: entry.title,
          description: entry.description || "",
          category: entry.category,
        };
      });
      replaceCardList(newCardList);
      setMessageClassToShow(messageClassNames.success);
    } else if (oldBoardData) {
      setCategories(oldBoardData.categories);
      const oldCardList = oldBoardData.entries.map((entry) => {
        return {
          title: entry.title,
          description: entry.description || "",
          category: entry.category,
        };
      });
      replaceCardList(oldCardList);
      setMessageClassToShow(messageClassNames.error);
    } else {
      console.error("[load-file]: The current board data is empty");
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
