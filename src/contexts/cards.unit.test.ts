import { describe, expect, it } from "vitest";

import { toCardsMap, updateCard } from "./cards.tsx";
import type { CardExtendedData } from "../app.types.ts";

import { cards } from "../../test/data/board.ts";

describe("toCardsMap", () => {
  it("should return an empty map when the cards list is empty", () => {
    const cardsList: CardExtendedData[] = [];
    const cardsMap = toCardsMap(cardsList);

    expect(cardsMap.size).toBe(0);
  });

  it("should return a map of cards per category index", () => {
    const cardsList = structuredClone(cards);
    const cardsMap = toCardsMap(cardsList);

    expect(cardsMap instanceof Map).toBe(true);

    const expectedMap = new Map([
      [0, [cards[0]]],
      [1, [cards[1], cards[2], cards[3]]],
      [2, [cards[4]]],
    ]);
    expect(cardsMap).toStrictEqual(expectedMap);
  });
});

describe("updateCard", () => {
  it("should not update cards when card is not updated", () => {
    const cardsList = structuredClone(cards);
    const card = structuredClone(cards[0]);

    const updatedCardsList = updateCard(cardsList, card);
    expect(updatedCardsList).toStrictEqual(cardsList);
  });

  it("should adjust cards when card updates position in the same category", () => {
    let cardsList = structuredClone(cards);
    /**
     * cardsList
     * first column: cardsList[0]
     * second column: cardsList[1], cardsList[2], cardsList[3]
     * third column: cardsList[4]
     */
    let cardToMove: CardExtendedData;
    let updatedCardsList: CardExtendedData[];

    /**
     * moving first card in second column to second position in same column
     */

    cardToMove = cardsList[1];
    updatedCardsList = updateCard(cardsList, {
      ...cardToMove,
      orderInCategory: 1.5,
    });
    expect(updatedCardsList).toStrictEqual([
      // first column
      cardsList[0],
      // second column
      { ...cardsList[2], orderInCategory: 0 },
      { ...cardsList[1], orderInCategory: 1 },
      cardsList[3],
      // third column
      cardsList[4],
    ]);

    /**
     * undoing previous movement
     * moving second card in second column to first position in second column
     */

    cardsList = structuredClone(updatedCardsList);
    /**
     * cardsList
     * first column: cardsList[0]
     * second column: cardsList[1], cardsList[2], cardsList[3]
     * third column: cardsList[4]
     */
    cardToMove = cardsList[2];
    updatedCardsList = updateCard(cardsList, {
      ...cardToMove,
      orderInCategory: -0.5,
    });
    expect(updatedCardsList).toStrictEqual(cards);
  });

  it("should adjust cards when card moves to another category", () => {
    let cardsList = structuredClone(cards);
    /**
     * cardsList
     * first column: cardsList[0]
     * second column: cardsList[1], cardsList[2], cardsList[3]
     * third column: cardsList[4]
     */
    let cardToMove: CardExtendedData;
    let updatedCardsList: CardExtendedData[];

    /**
     * moving first card in second column to the end of thirs column
     */

    cardToMove = cardsList[1];
    updatedCardsList = updateCard(cardsList, {
      ...cardToMove,
      categoryIdx: 2,
      orderInCategory: 1,
    });
    expect(updatedCardsList).toStrictEqual([
      // first column
      cardsList[0],
      // second column
      { ...cardsList[2], orderInCategory: 0 },
      { ...cardsList[3], orderInCategory: 1 },
      // third column
      cardsList[4],
      { ...cardsList[1], categoryIdx: 2, orderInCategory: 1 },
    ]);

    /**
     * moving first card in second column to the middle of third column
     */
    cardsList = structuredClone(updatedCardsList);
    /**
     * cardsList
     * first column: cardsList[0]
     * second column: cardsList[1], cardsList[2]
     * third column: cardsList[3], cardsList[4]
     */
    cardToMove = cardsList[1];
    updatedCardsList = updateCard(cardsList, {
      ...cardToMove,
      categoryIdx: 2,
      orderInCategory: 0.5,
    });
    expect(updatedCardsList).toStrictEqual([
      // first column
      cardsList[0],
      // second column
      { ...cardsList[2], orderInCategory: 0},
      // third column
      cardsList[3],
      { ...cardsList[1], categoryIdx: 2, orderInCategory: 1 },
      { ...cardsList[4], orderInCategory: 2 },
    ]);
  });
});
