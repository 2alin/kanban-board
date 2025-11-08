import { createContext, useEffect, useReducer } from "react";
import type { Action } from "./categoriesContext.types";
import storage from "../storage";

export const CategoriesContext = createContext<string[]>([]);
export const CategoriesDispatchContext = createContext<
  React.ActionDispatch<[action: Action]>
>(() => {});

interface CategoriesProviderProps {
  initialCategories: string[];
}

export function CategoriesProvider({
  initialCategories,
  children,
}: React.PropsWithChildren<CategoriesProviderProps>) {
  const [categories, dispatch] = useReducer(
    categoriesReducer,
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
 * @returns The new categories after the action executed
 */
function categoriesReducer(categories: string[], action: Action): string[] {
  switch (action.type) {
    case "set": {
      return [...action.categories];
    }
    case "rename": {
      const newCategories = [...categories];
      newCategories[action.id] = action.value.trim();
      return newCategories;
    }
    default: {
      return categories;
    }
  }
}
