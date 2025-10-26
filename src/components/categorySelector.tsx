interface CategorySelectorProps {
  id: string;
  categories: string[];
  defaultSelected: string;
  handleChange: React.ChangeEventHandler;
}

/**
 * A default handler for the on change event
 */
function defaultHandleChange() {
  // TBD the default behaviour of the handler
  // or if we need a default behaviour at all
}

export default function CategorySelector({
  id = "",
  categories,
  defaultSelected,
  handleChange = defaultHandleChange,
}: CategorySelectorProps) {
  return (
    <select
      name="category"
      id={id}
      defaultValue={defaultSelected}
      onChange={handleChange}
    >
      {categories.map((category) => (
        <option value={category} key={category}>
          {category}
        </option>
      ))}
    </select>
  );
}
