import { createContext, useContext, useEffect, useReducer } from "react";

import type { CategoryAction } from "./categories.types";
import storage from "../storage";
import { HistoryDispatchContext } from "./history";
import type { HistoryAction, HistoryChangeItem } from "./history.types";

export const CategoriesContext = createContext<string[]>([]);
export const CategoriesDispatchContext = createContext<
  React.ActionDispatch<[action: CategoryAction]>
>(() => {});

interface CategoriesProviderProps {
  initialCategories: string[];
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
 * @param historyDispatch Handler history change actions
 * @returns The new categories after the action executed
 */
function categoriesReducer(
  categories: string[],
  action: CategoryAction,
  historyDispatch: React.ActionDispatch<[action: HistoryAction]>,
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
    const changeItem: HistoryChangeItem = {
      type: "categories",
      value: [...newCategories],
    };
    // Update history after context render
    setTimeout(() => historyDispatch({ type: "add", changeItem }), 0);
  }

  return newCategories;
}
