import "./newCardButton.css";

import type { ModalState } from "../../app.types";
import IconButton from "./iconButton";
import type { SetStateAction } from "react";

interface NewCardButtonProps {
  label: string;
  categoryIdx?: number;
  setModalState: (value: SetStateAction<ModalState>) => void;
}

export default function NewCardButton({
  label,
  categoryIdx,
  setModalState,
}: NewCardButtonProps) {
  function handleNewCardButtonClick(event: React.MouseEvent) {
    const { target } = event;

    const origin = target instanceof HTMLElement ? target : undefined;

    setModalState({ type: "new", categoryIdx, origin });
  }

  return (
    <IconButton
      label={label}
      className="new-card button"
      onClick={handleNewCardButtonClick}
    />
  );
}
