export default function NewCardButton({ setModalState }) {
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
