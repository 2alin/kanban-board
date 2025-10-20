export default function NewCardButton() {
  function handleNewCardButtonClick() {
    document.body.classList.toggle("new-card", true);
  }

  return (
    <button id="new-card-button" onClick={handleNewCardButtonClick}>
      <span className="icon"></span>
    </button>
  );
}
