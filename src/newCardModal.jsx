import { createRoot } from "react-dom/client";

export default function NewCardModal({ boardCategories }) {
  const newCardFormID = "new-card-form";

  function clearForm() {
    const form = document.getElementById(newCardFormID);
    form.reset();
  }

  function handleSubmitButtonClick() {
    const form = document.getElementById(newCardFormID);
    console.log("FORM", form);
    form.requestSubmit();
  }

  function handleCancelButtonClick() {
    document.body.classList.toggle("new-card", false);
    clearForm();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const cardData = {
      category: formData.get("category"),
      title: formData.get("title"),
      description: formData.get("description"),
    };
    document.dispatchEvent(
      new CustomEvent("card.add", { detail: { cardData } })
    );

    document.body.classList.toggle("new-card", false);
    clearForm();
  }

  return (
    // TODO: replace this fragment by its aside element container
    // once we've moved up with react componentsi the DOM tree
    <>
      <section className="form container">
        <h2 className="title">New card</h2>
        <form
          name="new-card"
          target="_self"
          id={newCardFormID}
          onSubmit={handleSubmit}
        >
          <label htmlFor="new-card-title">Title: </label>
          <input type="text" name="title" id="new-card-title" required />
          <label htmlFor="new-card-description">Description: </label>
          <textarea
            name="description"
            id="new-card-description"
            cols="40"
            rows="4"
          ></textarea>
          <label htmlFor="new-card-category">Category: </label>
          <select name="category" id="new-card-category">
            {boardCategories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
        </form>
        <footer>
          <button id="cancel-new-card-button" onClick={handleCancelButtonClick}>
            cancel
          </button>
          <button id="submit-card-button" onClick={handleSubmitButtonClick}>
            add card
          </button>
        </footer>
      </section>
    </>
  );
}

export function initialize(boardCategories) {
  // TODO: change selector to an ID to make it less ambiguous
  const newCardModalElement = document.querySelector("aside.modal.new-card");
  const newCardModalRoot = createRoot(newCardModalElement);
  newCardModalRoot.render(<NewCardModal {...{ boardCategories }} />);
}
