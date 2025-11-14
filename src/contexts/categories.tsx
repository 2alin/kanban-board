import { createContext, useEffect, useReducer } from "react";

import type { HistoryChangeItem } from "../components/app.types";
import type { CategoryAction } from "./categories.types";
import storage from "../storage";

export const CategoriesContext = createContext<string[]>([]);
export const CategoriesDispatchContext = createContext<
  React.ActionDispatch<[action: CategoryAction]>
>(() => {});

interface CategoriesProviderProps {
  initialCategories: string[];
  handleHistoryChange: (historyChangeItem: HistoryChangeItem) => void;
}

export function CategoriesProvider({
  initialCategories,
  handleHistoryChange,
  children,
}: React.PropsWithChildren<CategoriesProviderProps>) {
  const [categories, dispatch] = useReducer(
    (categories, action) =>
      categoriesReducer(categories, action, handleHistoryChange),
    initialCategories
  );

  useEffect(() => {
    const boardData = storage.board.get();

    if (!boardData) {
      console.error("[boardData.sync] No local stored board data found");
      return;
    }

    boardData.categories = [...categories];
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
 * @param handleHistoryChange Handle when the new state should be added to history
 * @returns The new categories after the action executed
 */
function categoriesReducer(
  categories: string[],
  action: CategoryAction,
  handleHistoryChange: (historyChangeItem: HistoryChangeItem) => void
): string[] {
  let newCategories: string[] = [];

  switch (action.type) {
    case "set":
      newCategories = [...action.categories];
      break;
    case "rename":
      newCategories = [...categories];
      newCategories[action.id] = action.value.trim();
      break;
    default:
      newCategories = [...categories];
  }

  const { addToHistory } = action;
  if (addToHistory) {
    const historyChangeItem: HistoryChangeItem = {
      type: "categories",
      value: [...newCategories],
    };
    // workaround to update history after context render
    setTimeout(() => handleHistoryChange(historyChangeItem), 0);
  }

  return newCategories;
}
