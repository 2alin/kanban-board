interface TitleEditProps {
  defaultValue: string;
  handleSubmit: (value: string) => void;
  handleCancel: () => void;
}

export default function TitleEditForm({
  defaultValue,
  handleSubmit,
  handleCancel,
}: TitleEditProps) {
  return (
    <form
      className="edit form"
      action={(formData) => {
        const title = formData.get("title") || defaultValue;
        handleSubmit(title.toString());
      }}
    >
      <input
        type="text"
        name="title"
        className="edit title"
        autoFocus={true}
        autoComplete="off"
        defaultValue={defaultValue}
      />
      <button
        className="icon submit"
        aria-description="submit title edition"
        type="submit"
      >
        <span className="icon-img" />
      </button>
      <button
        className="icon cancel"
        aria-description="cancel title edition"
        formAction={handleCancel}
      >
        <span className="icon-img" />
      </button>
    </form>
  );
}
