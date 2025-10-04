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

/**
 * Sets app initial local data
 */
function setInitLocalData() {
  const initData = {
    categories: ["backlog", "todo", "today", "done"],
    entries: [],
  };
  setLocalData(initData);
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
 * Initializes the main app
 */
async function initialize() {
  // initialize app memory data
  boardData = getLocalData();
  if (!boardData) {
    setInitLocalData();
    boardData = getLocalData();
  }
  // const boardData = await getSampleData();

  initializeForm();
  renderBoard();
}

initialize();
