import { boardData as defaultBoardData } from "./defaultSettings.js";
import { parseBoardData } from "./parseBoardData.js";

const sampleDataLocation = "./board-sample-data.json";
const localStorageKey = "boardData";
let boardData;

/**
 * Retrieves a sample local data that can be used to fill the board
 *
 * @returns a board app sample data
 */
async function getSampleData() {
  const rawData = await fetch(sampleDataLocation);
  const jsonData = await rawData.json();
  return jsonData;
}

/**
 * Gets the app data stored locally
 *
 * @returns the app data stored locally as an object
 */
function getLocalData() {
  const localDataRaw = localStorage.getItem(localStorageKey);
  let localData;
  try {
    localData = JSON.parse(localDataRaw);
  } catch (error) {
    // there's possibilities that the data stored can't be parsed
    // fall back to a safe value that can be used for initialization
    localData = null;
  }
  return localData;
}

/**
 * Stores locally the app data as a stringified object
 *
 * @param {object} data the app data to be stored
 */
function setLocalData(data) {
  localStorage.setItem(localStorageKey, JSON.stringify(data));
}

function getColumnId(name) {
  return "column-" + name;
}

/**
 * Render the board columns without entries
 */
function renderColumns() {
  const boardElement = document.querySelector("#board");
  const columnTemplate = document.querySelector("#column-template");

  boardElement.innerHTML = "";

  const columnNames = boardData.categories;
  for (const name of columnNames) {
    const columnFragment = columnTemplate.content.cloneNode(true);

    const columnElement = columnFragment.querySelector(".column");
    columnElement.id = getColumnId(name);

    const titleElement = columnFragment.querySelector(".title");
    titleElement.textContent = name;

    boardElement.appendChild(columnFragment);
  }
}

/**
 * Renders the cards in all columns
 */
function renderCards() {
  const columnNames = boardData.categories;
  const entries = boardData.entries;

  for (const columnName of columnNames) {
    const columnElement = document.querySelector("#" + getColumnId(columnName));
    const listElement = columnElement.querySelector(".card-list");
    listElement.innerHTML = "";

    // filter out entries specific to a column
    const columnEntries = entries.filter(
      ({ category }) => category === columnName
    );

    // sort entries
    // higher index means that entry should go first
    columnEntries.sort((a, b) => b.categoryIdx - a.categoryIdx);

    columnEntries.forEach((cardData) => {
      addCardToColumn(cardData, columnElement);
    });
  }

  // the content of the board has changed
  // we shouldn't show a deprecetated download option
  setDownloadSectionVisibility(false);
}

/**
 * Adds a card to the specific column with the data given
 *
 * @param {object} cardData
 * @param {HTMLElement} columnElement
 */
function addCardToColumn(cardData, columnElement) {
  const cardTemplate = document.querySelector("#card-template");
  const listElement = columnElement.querySelector(".card-list");

  const listItemElement = document.createElement("li");
  const cardFragment = cardTemplate.content.cloneNode(true);

  // filling content
  const titleElement = cardFragment.querySelector(".title");
  const descriptionElement = cardFragment.querySelector(".description");
  const categoryElement = cardFragment.querySelector(".category");
  titleElement.textContent = cardData.title;
  descriptionElement.textContent = cardData.description;
  boardData.categories.forEach((category) => {
    const optionElement = document.createElement("option");
    optionElement.value = category;
    optionElement.textContent = category;
    categoryElement.appendChild(optionElement);
  });
  categoryElement.value = cardData.category;

  // adding card metadata
  const cardElement = cardFragment.querySelector(".card");
  cardElement.dataset.title = cardData.title;

  // event listeners
  const deleteButton = cardFragment.querySelector(".delete");
  deleteButton.addEventListener("click", handleDeleteCardEvent);
  categoryElement.addEventListener("change", handleCategoryChangeEvent);

  listItemElement.appendChild(cardFragment);
  listElement.appendChild(listItemElement);
}

/**
 * Handles click events on the delete button of a card
 *
 * @param {Event} event
 */
function handleDeleteCardEvent(event) {
  const cardElement = event.target.closest(".card");
  const cardTitle = cardElement.dataset.title;

  boardData.entries = boardData.entries.filter(
    (entry) => entry.title !== cardTitle
  );
  setLocalData(boardData);
  renderCards();
}

function handleCategoryChangeEvent(event) {
  const newCategory = event.target.value;
  const cardElement = event.target.closest(".card");
  const cardTitle = cardElement.dataset.title;

  const cardIndex = boardData.entries.findIndex(
    (entry) => entry.title === cardTitle
  );
  boardData.entries[cardIndex].category = newCategory;

  setLocalData(boardData);
  renderCards();
}

/**
 * Renders the whole board
 */
function renderBoard() {
  renderColumns();
  renderCards();
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
  setLocalData(boardData);
  renderBoard();

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
    setLocalData(boardData);
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
    renderBoard();
    setLocalData(boardData);
    success = true;
  } catch (error) {
    console.error("[load-file]: Error while trying to parse the data");
    console.error(error);
    boardData = JSON.parse(JSON.stringify(oldBoardData));
    initializeForm();
    renderBoard();
    setLocalData(boardData);
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
 * Initializes the main app
 */
async function initialize() {
  // initialize app memory data
  boardData = getLocalData();
  if (!boardData) {
    setLocalData(defaultBoardData);
    boardData = getLocalData();
  } else if (boardData.version !== defaultBoardData.version) {
    migrateData();
  }
  // const boardData = await getSampleData();

  initializeForm();
  renderBoard();

  // app event listeners
  const exportButton = document.querySelector("#export-button");
  exportButton.addEventListener("click", handleExportButtonClick);
  const importFileInput = document.querySelector("#import-file");
  importFileInput.addEventListener("change", handleImportFileChange);
  const loadSelectedButton = document.querySelector("#load-selected-button");
  loadSelectedButton.addEventListener("click", handleLoadFileEvent);
}

initialize();
