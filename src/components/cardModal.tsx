import { useContext, useState } from "react";

import { CardsDispatchContext } from "../contexts/cards";

import type { ModalState } from "./app.types";
import CardForm, { type CardFormData } from "./cardForm";

const modalTitle = new Map([
  ["new", "New card"],
  ["edit", "Edit card"],
]);
const submitButtonText = new Map([
  ["new", "add card"],
  ["edit", "save card"],
]);

interface CardModalProps {
  modalState: ModalState;
  onClose: () => void;
}

export default function CardModal({ modalState, onClose }: CardModalProps) {
  const cardsDispatch = useContext(CardsDispatchContext);

  if (!modalState) {
    return;
  }

  const initialFormData: CardFormData = {
    title: "",
    description: "",
    categorySelected: "",
  };

  if (modalState.type === "edit") {
    const { cardToEdit } = modalState;
    initialFormData.title = cardToEdit.title;
    initialFormData.description = cardToEdit.description;
    initialFormData.categorySelected = cardToEdit.categoryIdx.toString();
  } else if (modalState.type === "new") {
    initialFormData.categorySelected = (modalState.categoryIdx || 0).toString();
  }

  const [formData, setFormData] = useState(initialFormData);

  function clearFormData() {
    setFormData({ ...initialFormData });
  }

  function handleClose() {
    document.body.classList.toggle("show-modal", false);
    clearFormData();
    onClose();

    if (modalState?.origin) {
      modalState.origin.focus();
    }
  }

  function handleSubmit() {
    if (!modalState) {
      return;
    }

    switch (modalState.type) {
      case "new":
        const cardBaseData = {
          title: formData.title,
          description: formData.description,
          categoryIdx: Number(formData.categorySelected),
        };
        cardsDispatch({ type: "add", cardBaseData, addToHistory: true });
        break;
      case "edit":
        const newCardData = {
          id: modalState.cardToEdit.id,
          title: formData.title,
          description: formData.description,
          categoryIdx: Number(formData.categorySelected),
          orderInCategory: modalState.cardToEdit.orderInCategory,
        };
        cardsDispatch({ type: "update", newCardData, addToHistory: true });
        break;
      default:
        console.error("Card modal type not recognized");
    }

    handleClose();
  }

  function handleChange(newFormData: CardFormData) {
    setFormData({ ...newFormData });
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const { key } = event;

    switch (key) {
      case "Escape":
        handleClose();
        break;
      default:
      // nothing to do here
    }
  }

  return (
    <aside className="modal" onKeyDown={handleKeyDown}>
      <section className="form-container">
        <h2 className="title">{modalTitle.get(modalState.type) || ""}</h2>

        <CardForm
          formData={formData}
          onSubmit={handleSubmit}
          onChange={handleChange}
        />

        <footer>
          <button id="cancel-modal-card-button" onClick={handleClose}>
            cancel
          </button>
          <button id="submit-card-button" onClick={handleSubmit}>
            {submitButtonText.get(modalState.type) || ""}
          </button>
        </footer>
      </section>
    </aside>
  );
}
