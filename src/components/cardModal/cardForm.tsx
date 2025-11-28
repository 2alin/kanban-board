import { useContext } from "react";
import { CategoriesContext } from "../../contexts/categories";
import CategorySelector from "../shared/categorySelector";

const cardFormId = "modal-card-form";

export interface CardFormData {
  title: string;
  description: string;
  categorySelected: string;
}

interface CardFormProps {
  formData: CardFormData;
  onSubmit: (event: React.FormEvent) => void;
  onChange: (newFormData: CardFormData) => void;
}

export default function CardForm({
  formData,
  onSubmit,
  onChange,
}: CardFormProps) {
  const boardCategories = useContext(CategoriesContext);

  return (
    <form
      name="modal-card-form"
      target="_self"
      id={cardFormId}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
    >
      <label htmlFor="modal-card-title">Title: </label>
      <input
        autoFocus={true}
        type="text"
        name="title"
        id="modal-card-title"
        autoComplete="off"
        required
        value={formData.title}
        onChange={({ target }) => {
          onChange({ ...formData, title: target.value });
        }}
      />

      <label htmlFor="modal-card-description">Description: </label>
      <textarea
        name="description"
        id="modal-card-description"
        value={formData.description}
        onChange={({ target }) => {
          onChange({ ...formData, description: target.value });
        }}
      ></textarea>

      <label htmlFor="modal-card-category">Category: </label>
      <CategorySelector
        categories={boardCategories}
        defaultValue={formData.categorySelected}
        onChange={(newValue) => {
          onChange({ ...formData, categorySelected: newValue });
        }}
      />
    </form>
  );
}
