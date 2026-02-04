import { createContext, useContext, useEffect, useReducer } from "react";
import storage from "../storage";

import type { CategoryAction } from "./categories.types";
import { HistoryDispatchContext } from "./history";
import type { HistoryAction, HistoryChangeItem } from "./history.types";
import type { CategoryData } from "../app.types";

export const CategoriesContext = createContext<CategoryData[]>([]);
export const CategoriesDispatchContext = createContext<
  React.ActionDispatch<[action: CategoryAction]>
>(() => {});

interface CategoriesProviderProps {
  initialCategories: CategoryData[];
}

export function CategoriesProvider({
  initialCategories,
  children,
}: React.PropsWithChildren<CategoriesProviderProps>) {
  const historyDispatch = useContext(HistoryDispatchContext);

  const [categories, dispatch] = useReducer(
    (categories, action) =>
      categoriesReducer(categories, action, historyDispatch),
    initialCategories,
  );

  useEffect(() => {
    const boardData = storage.board.get();

    if (!boardData) {
      return;
    }

    boardData.categories = categories.map((category) => ({
      isCollapsed: category.isCollapsed || false,
      title: category.title,
    }));
    storage.board.set(boardData);
  }, [categories]);

  return (
    <CategoriesContext value={categories}>
      <CategoriesDispatchContext value={dispatch}>
        {children}
      </CategoriesDispatchContext>
    </CategoriesContext>
  );
}

/**
 * Handles actions on board categories
 *
 * @param categories The current list of categories
 * @param action The action to execute
 * @param historyDispatch Handler history change actions
 * @returns The new categories after the action executed
 */
function categoriesReducer(
  categories: CategoryData[],
  action: CategoryAction,
  historyDispatch: React.ActionDispatch<[action: HistoryAction]>,
): CategoryData[] {
  let newCategories: CategoryData[] = [];

  switch (action.type) {
    case "set":
      newCategories = structuredClone(action.categories);
      break;
    case "rename":
      newCategories = structuredClone(categories);
      newCategories[action.id].title = action.value.trim();
      break;
    default:
      newCategories = structuredClone(categories);
  }

  const { addToHistory } = action;
  if (addToHistory) {
    const changeItem: HistoryChangeItem = {
      type: "categories",
      value: structuredClone(newCategories),
    };
    // Update history after context render
    setTimeout(() => historyDispatch({ type: "add", changeItem }), 0);
  }

  return newCategories;
}
