import "./importField.css";

import { useContext, useState } from "react";

import storage from "../storage";
import { getRandomId } from "../utilities";
import { CategoriesDispatchContext } from "../contexts/categories";
import { CardsDispatchContext } from "../contexts/cards";
import { HistoryDispatchContext } from "../contexts/history";
import type { HistoryChangeItem } from "../contexts/history.types";

const messageClassNames = {
  none: "",
  error: "error",
  success: "success",
};

export default function ImportField() {
  const historyDispatch = useContext(HistoryDispatchContext);

  const [isFileSelected, setIsFileSelected] = useState(false);
  const [messageClassToShow, setMessageClassToShow] = useState(
    messageClassNames.none,
  );

  const categoriesDispatch = useContext(CategoriesDispatchContext);
  const cardsDispatch = useContext(CardsDispatchContext);

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
      "#import-file",
    ) as HTMLInputElement;

    if (!importFileInput.files) {
      console.error(
        "[load-file]: No 'files' property found in the input element",
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
        error,
      );
      storage.board.set(oldBoardData);
    }

    if (isNewBoardDataStored && newBoardData) {
      categoriesDispatch({
        type: "set",
        categories: newBoardData.categories,
      });
      const newCardList = newBoardData.entries.map((entry) => {
        return {
          id: getRandomId(),
          title: entry.title,
          description: entry.description || "",
          categoryIdx: entry.categoryIdx,
          orderInCategory: entry.orderInCategory,
        };
      });
      cardsDispatch({ type: "set", cards: newCardList });

      const historyChangeItem: HistoryChangeItem = {
        type: "board",
        value: {
          categories: structuredClone(newBoardData.categories),
          cards: structuredClone(newCardList),
        },
      };

      historyDispatch({ type: "add", changeItem: historyChangeItem });

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
    <article id="import-field" className={messageClassToShow}>
      <span className="field-name">Import: </span>
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
        Load Selected
      </button>
      <span className="success">Board data loaded succcesfully!</span>
      <span className="error">Error while loading board data!</span>
    </article>
  );
}
