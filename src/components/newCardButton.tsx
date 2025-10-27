interface NewCardButtonProps {
  setModalState: (value: React.SetStateAction<{ type: string }>) => void;
}

export default function NewCardButton({ setModalState }: NewCardButtonProps) {
  function handleNewCardButtonClick() {
    setModalState({ type: "new" });
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
