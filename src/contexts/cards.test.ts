import { describe, expect, it } from "vitest";

import { toCardsMap } from "./cards.tsx";
import type { CardExtendedData } from "../components/app.types";

import { cards } from "../../test/data/extendedCards.ts";

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
      [1, [cards[1], cards[2]]],
      [2, [cards[3]]],
    ]);
    expect(cardsMap).toStrictEqual(expectedMap);
  });
});
