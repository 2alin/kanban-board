import CategorySelector from "./categorySelector";

export default function CardModal({
  modalState,
  categories,
  cards,
  addCard,
  updateCard,
}) {
  const modalType = modalState.type;
  const modalTitle = {
    new: "New card",
    edit: "Edit card",
  };
  const submitButtonText = {
    new: "add card",
    edit: "save card",
  };
  const cardFormId = "modal-card-form";
  const selectCategoryId = "modal-card-category";

  let prefilledData = {
    category: categories[0],
    title: "",
    description: "",
  };

  if (modalState.type === "edit") {
    const cardToEdit = cards.find((card) => card.id === modalState.cardId);

    if (!cardToEdit) {
      throw new Error("No card to edit was found with the given Id");
    }

    prefilledData = {
      category: cardToEdit.category,
      title: cardToEdit.title,
      description: cardToEdit.description,
    };

    // patch: 'select' components don't render again
    // when the prop value used for defaultValue changes
    document.getElementById(selectCategoryId).value = prefilledData.category;
  }

  function clearForm() {
    const form = document.getElementById(cardFormId);
    form.reset();
  }

  function handleSubmitButtonClick() {
    const form = document.getElementById(cardFormId);
    form.requestSubmit();
  }

  function handleCancelButtonClick() {
    document.body.classList.toggle("card-modal", false);
    clearForm();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const cardData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
    };

    try {
      if (modalType === "new") {
        addCard(cardData);
      } else if (modalType === "edit") {
        if (!modalState.cardId) {
          throw new Error("No Id found in the card to edit");
        }

        updateCard({
          cardId: modalState.cardId,
          newTitle: cardData.title,
          newDescription: cardData.description,
          newCategory: cardData.category,
        });
      } else {
        throw new Error("Card modal type not recognized");
      }
    } catch (error) {
      console.error(error);
    }

    document.body.classList.toggle("card-modal", false);
    clearForm();
  }

  return (
    <aside className="modal">
      <section className="form-container">
        <h2 className="title">{modalTitle[modalType]}</h2>

        <form
          name="modal-card-form"
          target="_self"
          id={cardFormId}
          onSubmit={handleSubmit}
        >
          <label htmlFor="modal-card-title">Title: </label>
          <input
            type="text"
            name="title"
            id="modal-card-title"
            required
            defaultValue={prefilledData.title}
          />

          <label htmlFor="modal-card-description">Description: </label>
          <textarea
            name="description"
            id="modal-card-description"
            cols="40"
            rows="4"
            defaultValue={prefilledData.description}
          ></textarea>

          <label htmlFor="modal-card-category">Category: </label>
          <CategorySelector
            id={selectCategoryId}
            categories={categories}
            defaultSelectedy={prefilledData.category}
          />
        </form>

        <footer>
          <button
            id="cancel-modal-card-button"
            onClick={handleCancelButtonClick}
          >
            cancel
          </button>
          <button id="submit-card-button" onClick={handleSubmitButtonClick}>
            {submitButtonText[modalType]}
          </button>
        </footer>
      </section>
    </aside>
  );
}
