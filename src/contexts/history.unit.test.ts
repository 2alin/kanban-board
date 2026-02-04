import { describe, expect, it } from "vitest";
import { addChangeItem, maxHistoryAmount } from "./history";
import type {
  BoardHistory,
  BoardHistoryWithIdx,
  HistoryChangeItem,
} from "./history.types";
import { cards, categories } from "../../test/data/board";

const boardHistoryItem = { categories, cards };
const boardHistory: BoardHistory = [boardHistoryItem];
const boardHistoryWithIdx: BoardHistoryWithIdx = {
  boardHistory,
  historyIdx: 0,
};

describe("addChangeItem", () => {
  it("should add a full board history change item", () => {
    const newCards = structuredClone(cards);
    newCards[0].title = "Card 1 Updated";

    const newCategories = structuredClone(categories);
    newCategories[0] = { title: "Category 1 Updated" };

    const historyChangeItem: HistoryChangeItem = {
      type: "board",
      value: {
        cards: newCards,
        categories: newCategories,
      },
    };

    const { boardHistory: newBoardHistory, historyIdx: newHistoryIdx } =
      addChangeItem(boardHistoryWithIdx, historyChangeItem);

    expect(newBoardHistory[0]).toStrictEqual(boardHistoryItem);
    expect(newBoardHistory[1]).toStrictEqual({
      cards: newCards,
      categories: newCategories,
    });
    expect(newHistoryIdx).toBe(1);
  });

  it("should add a cards history change item", () => {
    const newCards = structuredClone(cards);
    newCards[0].title = "Card 1 Updated";

    const historyChangeItem: HistoryChangeItem = {
      type: "cards",
      value: newCards,
    };

    const { boardHistory: newBoardHistory, historyIdx: newHistoryIdx } =
      addChangeItem(boardHistoryWithIdx, historyChangeItem);

    expect(newBoardHistory[0]).toStrictEqual(boardHistoryItem);
    expect(newBoardHistory[1]).toStrictEqual({
      cards: newCards,
      categories,
    });
    expect(newHistoryIdx).toBe(1);
  });

  it("should add a categories history change item", () => {
    const newCategories = structuredClone(categories);
    newCategories[0] = { title: "Category 1 Updated" };

    const historyChangeItem: HistoryChangeItem = {
      type: "categories",
      value: newCategories,
    };

    const { boardHistory: newBoardHistory, historyIdx: newHistoryIdx } =
      addChangeItem(boardHistoryWithIdx, historyChangeItem);

    expect(newBoardHistory[0]).toStrictEqual(boardHistoryItem);
    expect(newBoardHistory[1]).toStrictEqual({
      cards,
      categories: newCategories,
    });
    expect(newHistoryIdx).toBe(1);
  });

  it("should keep only the maximum amount allowed", () => {
    let newBoardHistoryWithIdx = structuredClone(boardHistoryWithIdx);

    // let's change the first card title 10 times
    for (let k = 0; k < maxHistoryAmount; k++) {
      const newCards = structuredClone(cards);
      newCards[0].title = `Card 1 - Update ${k + 1}`;

      const historyChangeItem: HistoryChangeItem = {
        type: "cards",
        value: newCards,
      };

      newBoardHistoryWithIdx = addChangeItem(
        newBoardHistoryWithIdx,
        historyChangeItem,
      );
    }

    const { boardHistory: newBoardHistory, historyIdx: newHistoryIdx } =
      newBoardHistoryWithIdx;

    expect(newBoardHistory.length).toBe(maxHistoryAmount);
    expect(newHistoryIdx).toBe(maxHistoryAmount - 1);

    for (let k = 0; k < 10; k++) {
      expect(newBoardHistory[k].cards[0].title).toBe(
        `Card 1 - Update ${k + 1}`,
      );
    }
  });
});
