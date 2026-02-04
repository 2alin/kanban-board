import IconButton from "../shared/iconButton";

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

      <IconButton
        label="submit title edition"
        className="submit"
        type="submit"
      />
      <IconButton
        label="cancel title edition"
        className="icon cancel"
        formAction={handleCancel}
      />
    </form>
  );
}
