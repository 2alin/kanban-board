import {
  useContext,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";

import type { ModalState } from "../app.types";
import { CategoriesDispatchContext } from "../../contexts/categories";
import ColumnMenu from "./columnMenu";
import CounterBadge from "./counterBadge";
import TitleEditForm from "./titleEditForm";
import IconButton from "../shared/iconButton";

interface ColumnHeaderProps {
  title: string;
  headerId: string;
  columnId: number;
  columnRef: RefObject<HTMLElement | null>;
  cardsAmount: number;
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
  setModalState: Dispatch<SetStateAction<ModalState>>;
}

export default function ColumnHeader({
  title,
  headerId,
  columnId,
  columnRef,
  cardsAmount,
  isCollapsed,
  setIsCollapsed,
  setModalState,
}: ColumnHeaderProps) {
  const categoriesDispatch = useContext(CategoriesDispatchContext);

  const [isTitleEdit, setIsTitleEdit] = useState(false);

  return (
    <header>
      {isTitleEdit ? (
        <TitleEditForm
          defaultValue={title}
          handleSubmit={(value) => {
            categoriesDispatch({
              type: "rename",
              id: columnId,
              value,
              addToHistory: true,
            });
            setIsTitleEdit(false);
          }}
          handleCancel={() => {
            setIsTitleEdit(false);
          }}
        />
      ) : (
        <>
          {isCollapsed && (
            <IconButton
              label="Expand column"
              className="expand"
              onClick={() => setIsCollapsed(false)}
            />
          )}
          <CounterBadge amount={cardsAmount} />
          <h2 className="show title" id={headerId}>
            {title}
          </h2>
          <ColumnMenu
            {...{
              columnId,
              columnRef,
              setIsTitleEdit,
              setIsCollapsed,
              setModalState,
            }}
          />
        </>
      )}
    </header>
  );
}
