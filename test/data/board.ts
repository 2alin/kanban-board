import type { CardExtendedData } from "../../src/components/app.types";

/**
 * Category names used to create columns
 */

export const categories: string[] = ["Category 1", "Category 2", "Category 3"];

/**
 * Card memory data used by the app
 */
export const cards: CardExtendedData[] = [
  {
    id: "card-1",
    title: "Card 1",
    description: "Description of Card 1",
    categoryIdx: 0,
    orderInCategory: 0,
  },
  {
    id: "card-2",
    title: "Card 2",
    description: "Description of Card 2",
    categoryIdx: 1,
    orderInCategory: 0,
  },
  {
    id: "card-3",
    title: "Card 3",
    description: "Description of Card 3",
    categoryIdx: 1,
    orderInCategory: 1,
  },
  {
    id: "card-4",
    title: "Card 4",
    description: "Description of Card 4",
    categoryIdx: 1,
    orderInCategory: 2,
  },
  {
    id: "card-5",
    title: "Card 5",
    description: "Description of Card 5",
    categoryIdx: 2,
    orderInCategory: 0,
  },
];
