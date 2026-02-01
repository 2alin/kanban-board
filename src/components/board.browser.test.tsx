import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import Board from "./board";
import { CategoriesProvider } from "../contexts/categories";
import { CardsProvider } from "../contexts/cards";
import type { CardExtendedData } from "./app.types";
import { cards } from "../../test/data/board";
import storage from "../storage";

vi.spyOn(storage.board, "get").mockImplementation(() => null);
vi.spyOn(storage.board, "set").mockImplementation(() => true);
vi.spyOn(storage.board.entries, "set").mockImplementation(() => true);

const cardFirstColumn = cards[0];
const cardsSecondColumn = [cards[1], cards[2]];

function renderBoard(columns: string[], cards: CardExtendedData[] = []) {
  return render(
    <CategoriesProvider initialCategories={columns}>
      <CardsProvider initialCards={cards}>
        <Board
          {...{
            setModalState: () => {},
            setLastChangedBoard: () => {},
            handleHistoryChange: () => {},
          }}
        />
      </CardsProvider>
    </CategoriesProvider>,
  );
}

describe("Board Component", () => {
  it("should create a new column ahead", async () => {
    await renderBoard(["Test Column"]);

    const columns = page.getByRole("region", { name: "column" });
    expect(columns.elements().length).toBe(1);

    const columnMenuButton = page.getByRole("button", {
      name: "Column options menu",
    });
    await columnMenuButton.click();

    const addColumnRightButton = page.getByRole("menuitem", {
      name: "Add Column Ahead",
    });
    await addColumnRightButton.click();

    expect(columns.elements().length).toBe(2);
    await expect
      .element(columns.nth(0).getByText("Test Column"))
      .toBeInTheDocument();
    await expect
      .element(columns.nth(1).getByText("New Column"))
      .toBeInTheDocument();
  });

  it("should create a new column behind", async () => {
    await renderBoard(["Test Column"]);

    const columns = page.getByRole("region", { name: "column" });
    expect(columns.elements().length).toBe(1);

    const columnMenuButton = page.getByRole("button", {
      name: "Column options menu",
    });
    await columnMenuButton.click();

    const addColumnRightButton = page.getByRole("menuitem", {
      name: "Add Column Behind",
    });
    await addColumnRightButton.click();

    expect(columns.elements().length).toBe(2);
    await expect
      .element(columns.nth(0).getByText("New Column"))
      .toBeInTheDocument();
    await expect
      .element(columns.nth(1).getByText("Test Column"))
      .toBeInTheDocument();
  });

  it("should move cards when adding a column", async () => {
    await renderBoard(["Test Column"], [structuredClone(cardFirstColumn)]);

    const columnMenuButton = page.getByRole("button", {
      name: "Column options menu",
    });
    await columnMenuButton.click();

    const addColumnRightButton = page.getByRole("menuitem", {
      name: "Add Column Behind",
    });
    await addColumnRightButton.click();

    const columns = page.getByRole("region", { name: "column" });

    await expect
      .element(columns.nth(0).getByRole("listitem"))
      .not.toBeInTheDocument();
    await expect
      .element(
        columns
          .nth(1)
          .getByRole("listitem", { hasText: cardFirstColumn.title }),
      )
      .toBeInTheDocument();
  });

  it("should delete a column", async () => {
    await renderBoard(["First Column", "Second Column"]);

    const columns = page.getByRole("region", { name: "column" });
    expect(columns.elements().length).toBe(2);

    // removing first column
    const columnMenuButton = columns.nth(0).getByRole("button", {
      name: "Column options menu",
    });
    await columnMenuButton.click();
    const deleteColumnButton = columns.nth(0).getByRole("menuitem", {
      name: "Remove column",
    });
    await deleteColumnButton.click();

    expect(columns.elements().length).toBe(1);
    await expect
      .element(columns.getByText("Second Column"))
      .toBeInTheDocument();
  });

  it("should move cards when deleting a column", async () => {
    await renderBoard(["First Column", "Second Column"], cardsSecondColumn);

    const columns = page.getByRole("region", { name: "column" });

    //removing first column
    const columnMenuButton = columns.nth(0).getByRole("button", {
      name: "Column options menu",
    });
    await columnMenuButton.click();
    const deleteColumnButton = columns.nth(0).getByRole("menuitem", {
      name: "Remove column",
    });
    await deleteColumnButton.click();

    await expect.element(columns.nth(0)).toHaveAccessibleName("Second Column");
    await expect
      .element(
        columns
          .nth(0)
          .getByRole("heading", { name: cardsSecondColumn[0].title }),
      )
      .toBeInTheDocument();
    await expect
      .element(
        columns
          .nth(0)
          .getByRole("heading", { name: cardsSecondColumn[1].title }),
      )
      .toBeInTheDocument();
  });

  it("shouldn't allow to remove an alone column", async () => {
    await renderBoard(["Test Column"]);

    const columnMenuButton = page.getByRole("button", {
      name: "Column options menu",
    });
    await columnMenuButton.click();

    await expect
      .element(
        page.getByRole("menuitem", {
          name: "Remove column",
        }),
      )
      .not.toBeInTheDocument();
  });
});
