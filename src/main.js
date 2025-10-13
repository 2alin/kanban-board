import { boardData as defaultBoardData } from "./defaultSettings.js";
import { parseBoardData } from "./parseBoardData.js";
import localStorage from "./localStorage.js";
import { renderBoard, initialize as initializeBoard } from "./board.jsx";

let boardData;

const validThemes = ["blackwhite", "color-1", "color-am-1", "color-am-2"];
const defaultTheme = validThemes[1];

/**
 * Handles delete card events
 *
 * @param {string} cardTitle - Title of the card to delete
 */
function handleDeleteCardEvent(cardTitle) {
  boardData.entries = boardData.entries.filter(
    (entry) => entry.title !== cardTitle
  );
  localStorage.board.set(boardData);
  updateBoard();
}

/**
 * Handles category change events of a card
 *
 * @param {string} cardTitle - Title of the card to delete
 * @param {string} newCategory - new category selected for the card
 */
function handleCategoryChangeEvent(cardTitle, newCategory) {
  const cardIndex = boardData.entries.findIndex(
    (entry) => entry.title === cardTitle
  );
  boardData.entries[cardIndex].category = newCategory;

  localStorage.board.set(boardData);
  updateBoard();
}

/**
 * Updates the board
 */
function updateBoard() {
  renderBoard(boardData);
  // the content of the board has changed
  // we shouldn't show a deprecetated download option
  setDownloadSectionVisibility(false);
}

/**
 * Handles the submition of new cards
 *
 * @param {SubmitEvent} event
 */
function handleAddCardEvent(event) {
  const formData = new FormData(event.target);
  const newCard = {
    categoryIdx: 0,
    category: formData.get("category"),
    title: formData.get("title"),
    description: formData.get("description"),
  };

  boardData.entries.push(newCard);
  localStorage.board.set(boardData);
  updateBoard();

  clearForm();
}

/**
 * Initializes layout, data and event handlers in the form
 */
function initializeForm() {
  const form = document.querySelector("#new-card-form");

  const selectElement = document.querySelector("#new-card-category");
  boardData.categories.forEach((category) => {
    const optionElement = document.createElement("option");
    optionElement.value = category;
    optionElement.textContent = category;

    selectElement.appendChild(optionElement);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleAddCardEvent(event);
    document.body.classList.toggle("new-card", false);
  });

  const submitButton = document.querySelector("#submit-card-button");
  submitButton.addEventListener("click", () => {
    form.requestSubmit();
  });

  const cancelButton = document.querySelector("#cancel-new-card-button");
  cancelButton.addEventListener("click", () => {
    document.body.classList.toggle("new-card", false);
    clearForm();
  });
}

/**
 * Clear forms data
 */
function clearForm() {
  const form = document.querySelector("#new-card-form");
  form.reset();
}

/**
 * Migrates olver versions of board data to the newest version
 */
function migrateData() {
  if (!boardData.version) {
    boardData.version = defaultBoardData.version;
    localStorage.board.set(boardData);
  }
}

/**
 * Sets the visibility of the download board data section
 * and updates its elements accordingly
 *
 * @param {boolean} isVisible
 */
function setDownloadSectionVisibility(isVisible) {
  const downloadSection = document.querySelector("span.download");

  if (isVisible) {
    downloadSection.toggleAttribute("hidden", false);
  } else {
    const downloadAnchor = document.querySelector("a.download");
    downloadAnchor.href = "";

    downloadSection.toggleAttribute("hidden", true);
  }
}

/**
 * Handles the event when the export button is clicked
 */
function handleExportButtonClick() {
  const downloadAnchor = document.querySelector("a.download");
  const blob = new Blob([JSON.stringify(boardData, null, 2)], {
    type: "application/json",
  });
  downloadAnchor.href = URL.createObjectURL(blob);
  const dateID = new Date().toISOString();
  downloadAnchor.download = `board-${dateID}.json`;

  setDownloadSectionVisibility(true);
}

async function handleLoadFileEvent() {
  const loadButton = document.querySelector("#load-selected-button");
  const importFileInput = document.querySelector("#import-file");
  const [file] = importFileInput.files;

  if (!file) {
    console.error("[load-file]: No import file selected");
    return;
  }

  const textData = await file.text();
  const jsonData = JSON.parse(textData);

  let success = false;
  const oldBoardData = JSON.parse(JSON.stringify(boardData));
  try {
    boardData = parseBoardData(jsonData);
    initializeForm();
    updateBoard();
    localStorage.board.set(boardData);
    success = true;
  } catch (error) {
    console.error("[load-file]: Error while trying to parse the data");
    console.error(error);
    boardData = JSON.parse(JSON.stringify(oldBoardData));
    initializeForm();
    updateBoard();
    localStorage.board.set(boardData);
  }

  // clearing file import section
  importFileInput.value = null;
  loadButton.toggleAttribute("hidden", true);
  const importSection = document.querySelector("footer .import");
  if (success) {
    importSection.classList.toggle("success", true);
  } else {
    importSection.classList.toggle("error", true);
  }
  // success & error messages are only temporally visible
  setTimeout(() => {
    importSection.classList.toggle("success", false);
    importSection.classList.toggle("error", false);
  }, 3 * 1000);
}

/**
 * Handles the event when the user has selected a file
 * in the import input element
 */
function handleImportFileChange() {
  const loadButton = document.querySelector("#load-selected-button");
  loadButton.toggleAttribute("hidden", false);

  const importSection = document.querySelector("footer .import");
  importSection.classList.toggle("success", false);
  importSection.classList.toggle("error", false);
}

/**
 * Initializes the selected theme and theme selectors
 */
function initializeTheme() {
  let theme = localStorage.theme.get();
  if (!validThemes.includes(theme)) {
    theme = defaultTheme;
    localStorage.theme.set(theme);
  }
  document.body.dataset.theme = theme;

  // initializes theme selectors

  const container = document.querySelector("section.theme-selector");
  const template = container.querySelector("template");
  for (const theme of validThemes) {
    const themeSelectorFragment = template.content.cloneNode(true);
    const themeSelector = themeSelectorFragment.querySelector("button");
    themeSelector.dataset.theme = theme;

    themeSelector.addEventListener("click", (event) => {
      const { target } = event;
      const { theme: themeSelected } = target.closest("[data-theme]").dataset;
      document.body.dataset.theme = themeSelected;
      localStorage.theme.set(themeSelected);
    });

    container.appendChild(themeSelectorFragment);
  }
}

/**
 * Initializes the main app
 */
async function initialize() {
  initializeTheme();

  // initialize app memory data
  boardData = localStorage.board.get();
  if (!boardData) {
    localStorage.board.set(defaultBoardData);
    boardData = localStorage.board.get();
  } else if (boardData.version !== defaultBoardData.version) {
    migrateData();
  }
  // const boardData = await getSampleData();

  initializeForm();
  initializeBoard();
  updateBoard();

  // -------------------
  // app event listeners
  // -------------------

  const newCardButton = document.querySelector("#new-card-button");
  newCardButton.addEventListener("click", () => {
    document.body.classList.toggle("new-card", true);
  });

  document.addEventListener("card.delete", ({ detail }) => {
    handleDeleteCardEvent(detail.title);
  });

  document.addEventListener("card.category.change", ({ detail }) => {
    handleCategoryChangeEvent(detail.title, detail.newCategory);
  });

  const exportButton = document.querySelector("#export-button");
  exportButton.addEventListener("click", handleExportButtonClick);

  const importFileInput = document.querySelector("#import-file");
  importFileInput.addEventListener("change", handleImportFileChange);

  const loadSelectedButton = document.querySelector("#load-selected-button");
  loadSelectedButton.addEventListener("click", handleLoadFileEvent);
}

initialize();
