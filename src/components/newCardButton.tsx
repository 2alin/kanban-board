import type { ModalState } from "./app.types";
import IconButton from "./shared/iconButton";

interface NewCardButtonProps {
  setModalState: (value: React.SetStateAction<ModalState>) => void;
}

export default function NewCardButton({ setModalState }: NewCardButtonProps) {
  function handleNewCardButtonClick(event: React.MouseEvent) {
    const { target } = event;

    const origin = target instanceof HTMLElement ? target : undefined;

    setModalState({ type: "new", origin });
  }

  return (
    <IconButton
      label="Add new card to board"
      className="icon"
      id="new-card-button"
      onClick={handleNewCardButtonClick}
    />
  );
}
