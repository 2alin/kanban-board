import "./cardModal.css";

import { useContext, useEffect, useRef, useState } from "react";

import { CardsDispatchContext } from "../../contexts/cards";

import type { ModalState } from "../../app.types";
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
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
}

export default function CardModal({
  modalState,
  setModalState,
}: CardModalProps) {
  const cardsDispatch = useContext(CardsDispatchContext);
  const modalRef = useRef<null | HTMLDialogElement>(null);

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

  function cleanDialog() {
    clearFormData();

    setModalState(null);

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

    modalRef.current?.close();
  }

  function handleChange(newFormData: CardFormData) {
    setFormData({ ...newFormData });
  }

  /**
   * Syncs opening/closing dialog with its component state
   */
  useEffect(() => {
    if (modalState) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [modalState]);

  return (
    <dialog className="modal" ref={modalRef} onClose={cleanDialog}>
      <section className="form-container">
        <header>
          <h2 className="title">{modalTitle.get(modalState.type) || ""}</h2>
          <button
            className="icon cancel"
            id="cancel-modal-card-button"
            aria-label="cancel new card form"
            onClick={() => modalRef.current?.close()}
          >
            <span className="icon-img"></span>
          </button>
        </header>

        <CardForm
          formData={formData}
          onSubmit={handleSubmit}
          onChange={handleChange}
        />

        <footer>
          <button id="submit-card-button" onClick={handleSubmit}>
            {submitButtonText.get(modalState.type) || ""}
          </button>
        </footer>
      </section>
    </dialog>
  );
}
