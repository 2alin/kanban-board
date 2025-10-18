import { createRoot } from "react-dom/client";

export default function NewCardModal({ categories, addCard }) {
  const newCardFormID = "new-card-form";

  function clearForm() {
    const form = document.getElementById(newCardFormID);
    form.reset();
  }

  function handleSubmitButtonClick() {
    const form = document.getElementById(newCardFormID);
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

    addCard(cardData);

    document.body.classList.toggle("new-card", false);
    clearForm();
  }

  return (
    <aside className="modal new-card">
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
            {categories.map((category) => (
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
    </aside>
  );
}

export function initialize(categories) {
  // TODO: change selector to an ID to make it less ambiguous
  const newCardModalElement = document.querySelector("aside.modal.new-card");
  const newCardModalRoot = createRoot(newCardModalElement);
  newCardModalRoot.render(<NewCardModal {...{ categories }} />);
}
