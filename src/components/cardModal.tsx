import { toCardList } from "./app";
import type {
  CardBaseData,
  CardExtendedData,
  CardsMap,
  ModalState,
} from "./app.types";
import CategorySelector from "./categorySelector";

interface CardModalProps {
  modalState: ModalState;
  cardsMap: CardsMap;
  boardCategories: string[];
  handlers: {
    addCard: (cardData: CardBaseData) => void;
    updateCard: (cardData: CardExtendedData) => void;
  };
}

export default function CardModal({
  modalState,
  cardsMap,
  boardCategories,
  handlers,
}: CardModalProps) {
  const { addCard, updateCard } = handlers;

  const modalType = modalState.type;
  const modalTitle = new Map([
    ["new", "New card"],
    ["edit", "Edit card"],
  ]);
  const submitButtonText = new Map([
    ["new", "add card"],
    ["edit", "save card"],
  ]);
  const cardFormId = "modal-card-form";
  const selectCategoryId = "modal-card-category";

  let prefilledData = {
    title: "",
    description: "",
    category: boardCategories[0],
    categoryIdx: 0,
  };

  if (modalState.type === "edit") {
    const cardList = toCardList(cardsMap);
    const cardToEdit = cardList.find((card) => card.id === modalState.cardId);

    if (!cardToEdit) {
      throw new Error("No card to edit was found with the given Id");
    }

    prefilledData = {
      category: cardToEdit.category,
      title: cardToEdit.title,
      description: cardToEdit.description,
      categoryIdx: cardToEdit.categoryIdx,
    };

    // patch: 'select' components don't render again
    // when the prop value used for defaultValue changes
    const selectElement = document.getElementById(selectCategoryId);
    if (selectElement instanceof HTMLSelectElement) {
      selectElement.value = prefilledData.category;
    }
  }

  function clearForm() {
    const form = document.getElementById(cardFormId);

    if (!(form instanceof HTMLFormElement)) {
      console.error("The target form to clear is not a Form element ");
      return;
    }

    form.reset();
  }

  function handleSubmitButtonClick() {
    const form = document.getElementById(cardFormId);

    if (!(form instanceof HTMLFormElement)) {
      console.error("The target form to submit is not a Form element ");
      return;
    }

    form.requestSubmit();
  }

  function handleCancelButtonClick() {
    document.body.classList.toggle("show-modal", false);
    clearForm();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const formElement = event.target;

    if (!(formElement instanceof HTMLFormElement)) {
      console.error("No form element found to submit its data");
      return;
    }

    const formData = new FormData(formElement);
    const [formTitle, formDescription, formCategory] = [
      "title",
      "description",
      "category",
    ].map((fieldName) => formData.get(fieldName));

    if (
      formTitle === null ||
      formDescription === null ||
      formCategory === null
    ) {
      console.error("Couldn't get the data required to submit the form");
      document.body.classList.toggle("show-modal", false);
      clearForm();
      return;
    }

    const cardData = {
      title: formTitle.toString(),
      description: formDescription.toString(),
      category: formCategory.toString(),
    };

    try {
      if (modalType === "new") {
        addCard(cardData);
      } else if (modalType === "edit") {
        if (!modalState.cardId) {
          throw new Error("No Id found in the card to edit");
        }

        updateCard({
          id: modalState.cardId,
          title: cardData.title,
          description: cardData.description,
          category: cardData.category,
          categoryIdx: prefilledData.categoryIdx,
        });
      } else {
        throw new Error("Card modal type not recognized");
      }
    } catch (error) {
      console.error(error);
    }

    document.body.classList.toggle("show-modal", false);
    clearForm();
  }

  return (
    <aside className="modal">
      <section className="form-container">
        <h2 className="title">{modalTitle.get(modalType) || ""}</h2>

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
            defaultValue={prefilledData.description}
          ></textarea>

          <label htmlFor="modal-card-category">Category: </label>
          <CategorySelector
            id={selectCategoryId}
            categories={boardCategories}
            defaultSelected={prefilledData.category}
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
            {submitButtonText.get(modalType) || ""}
          </button>
        </footer>
      </section>
    </aside>
  );
}
