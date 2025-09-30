const sampleDataLocation = "./board-sample-data.json";

async function getSampleData() {
  const rawData = await fetch(sampleDataLocation);
  const jsonData = await rawData.json();
  return jsonData;
}

function getColumnId(name) {
  return "column-" + name;
}

function renderColumns(names) {
  const mainElement = document.querySelector("main");
  const columnTemplate = document.querySelector("#column-template");

  for (const name of names) {
    const columnFragment = columnTemplate.content.cloneNode(true);

    const columnElement = columnFragment.querySelector(".column");
    columnElement.id = getColumnId(name);

    const titleElement = columnFragment.querySelector(".title");
    titleElement.textContent = name;

    mainElement.appendChild(columnFragment);
  }
}

function renderCards(entries, visibleColumnNames) {
  const mainElement = document.querySelector("main");

  for (const columnName of visibleColumnNames) {
    const columnElement = document.querySelector("#" + getColumnId(columnName));
    const listElement = columnElement.querySelector(".card-list");
    const cardTemplate = document.querySelector("#card-template");

    // filter out entries specific to a column
    const columnEntries = entries.filter(
      ({ boardCategory }) => boardCategory === columnName
    );

    // sort entries
    // higher index means that entry should go first
    columnEntries.sort((a, b) => b.categoryIdx - a.categoryIdx);

    columnEntries.forEach((entry) => {
      const listItemElement = document.createElement("li");
      const cardFragment = cardTemplate.content.cloneNode(true);

      const titleElement = cardFragment.querySelector(".title");
      const descriptionElement = cardFragment.querySelector(".description");

      titleElement.textContent = entry.title;
      descriptionElement.textContent = entry.description;

      listItemElement.appendChild(cardFragment);
      listElement.appendChild(listItemElement);
    });
  }
}

async function initialize() {
  const boardData = await getSampleData();

  // render columns
  const visibleColumnNames = boardData.boardCategories;
  // TODO: safe check that the column names are unique
  renderColumns(visibleColumnNames);

  // render cards
  const entries = boardData.entries;
  renderCards(entries, visibleColumnNames);

  const boardElement = document.querySelector("#board");
}

initialize();
