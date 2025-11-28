import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import Board from "./board";
import { CategoriesProvider } from "../contexts/categories";
import { CardsProvider } from "../contexts/cards";
import type { CardExtendedData } from "./app.types";
import { cards } from "../../test/data/extendedCards";

vi.mock("../storage", () => {
  return {
    default: {
      board: {
        get: () => null,
        set: () => {},
        entries: {
          set: () => {},
        },
      },
    },
  };
});

const cardFirstcolumn = cards[0];

function renderBoardWithColumn(
  columnTitle: string,
  cards: CardExtendedData[] = []
) {
  return render(
    <CategoriesProvider
      initialCategories={[columnTitle]}
      handleHistoryChange={() => {}}
    >
      <CardsProvider initialCards={cards} handleHistoryChange={() => {}}>
        <Board
          handlers={{
            setModalState: () => {},
            setLastChangedBoard: () => {},
            handleHistoryChange: () => {},
          }}
        />
      </CardsProvider>
    </CategoriesProvider>
  );
}

describe("Board Component", () => {
  it("should create a new column ahead", async () => {
    await renderBoardWithColumn("Test Column");

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
    await renderBoardWithColumn("Test Column");

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
    await renderBoardWithColumn("Test Column", [
      structuredClone(cardFirstcolumn),
    ]);

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
        columns.nth(1).getByRole("listitem", { hasText: cardFirstcolumn.title })
      )
      .toBeInTheDocument();
  });
});
