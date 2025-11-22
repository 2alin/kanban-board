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
      onKeyDown={(event) => event.key === "Escape" && handleCancel()}
    >
      <input
        type="text"
        name="title"
        className="edit title"
        autoFocus={true}
        autoComplete="off"
        defaultValue={defaultValue}
        aria-label="Column title"
      />
      <button
        className="icon submit"
        aria-label="submit title edition"
        type="submit"
      >
        <span className="icon-img" />
      </button>
      <button
        className="icon cancel"
        aria-label="cancel title edition"
        formAction={handleCancel}
      >
        <span className="icon-img" />
      </button>
    </form>
  );
}
