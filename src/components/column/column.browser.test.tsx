import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import Column from "./column";
import type { CardExtendedData } from "../../app.types";
import { page, userEvent } from "vitest/browser";
import { cards } from "../../../test/data/board";

const columnId = 0;
const columnTitle = "Test column";

function renderColumn(cards: CardExtendedData[]) {
  return render(
    <Column
      columnId={columnId}
      title={columnTitle}
      isCollapsed={false}
      cards={cards}
      {...{
        cardDragState: null,
        setCardDragState: () => {},
        setModalState: () => {},
      }}
    />,
  );
}

const columnCards: CardExtendedData[] = cards.map((card) => ({
  ...card,
  categoryIdx: columnId,
}));

async function enterEditTitleMode() {
  const columnMenuButton = page.getByRole("button", {
    name: "Column options menu",
  });
  await columnMenuButton.click();

  const editColumnTitleButton = page.getByRole("menuitem", {
    name: "Edit Column Title",
  });
  await editColumnTitleButton.click();
}

async function exitEditTitleMode() {
  const exitEditButton = page.getByRole("button", {
    name: "cancel title edition",
  });
  await exitEditButton.click();
}

describe("Column component", () => {
  it("should render column header", async () => {
    await renderColumn([]);

    const header = page.getByRole("heading", { name: columnTitle });
    await expect.element(header).toBeInTheDocument();

    const columnMenuButton = page.getByRole("button", {
      name: "Column options menu",
    });
    await expect.element(columnMenuButton).toBeInTheDocument();
  });

  it("shouldn't render cards when no cards are given", async () => {
    await renderColumn([]);

    const cardsList = page.getByRole("list");
    await expect
      .element(cardsList.getByRole("listitem"))
      .not.toBeInTheDocument();
  });

  it("should render cards when cards are given", async () => {
    await renderColumn(columnCards);

    const cardItems = page.getByRole("listitem").elements();
    expect(cardItems.length).toBe(columnCards.length);

    for (const card of columnCards) {
      const cardItem = page.getByText(card.title, { exact: true });
      await expect.element(cardItem).toBeInTheDocument();
    }
  });

  it("should allow title to enter and quit edit mode", async () => {
    await renderColumn([]);

    // edit mode
    await enterEditTitleMode();
    await expect
      .element(page.getByRole("textbox", { name: "Column title" }))
      .toBeInTheDocument();
    await expect
      .element(page.getByRole("heading", { name: columnTitle }))
      .not.toBeInTheDocument();

    // exit mode through 'cancel' button
    await exitEditTitleMode();
    await expect
      .element(page.getByRole("textbox", { name: "Column title" }))
      .not.toBeInTheDocument();
    await expect
      .element(page.getByRole("heading", { name: columnTitle }))
      .toBeInTheDocument();

    // test exit mode through 'escape' key
    await enterEditTitleMode();
    await userEvent.keyboard("{Escape}");
    await expect
      .element(page.getByRole("textbox", { name: "Column title" }))
      .not.toBeInTheDocument();
    await expect
      .element(page.getByRole("heading", { name: columnTitle }))
      .toBeInTheDocument();
  });
});
