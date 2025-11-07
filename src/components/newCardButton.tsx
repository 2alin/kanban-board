import type { ModalState } from "./app.types";

interface NewCardButtonProps {
  setModalState: (value: React.SetStateAction<ModalState>) => void;
}

export default function NewCardButton({ setModalState }: NewCardButtonProps) {
  function handleNewCardButtonClick(event: React.MouseEvent) {
    const { target } = event;

    const origin = target instanceof HTMLElement ? target : undefined;

    setModalState({ type: "new", origin });
    document.body.classList.toggle("show-modal", true);
  }

  return (
    <button
      className="icon"
      id="new-card-button"
      onClick={handleNewCardButtonClick}
    >
      <span className="icon-img"></span>
    </button>
  );
}
