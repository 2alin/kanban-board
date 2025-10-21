export default function CategorySelector({ id = "", categories, defaultSelected, handleChange = null }) {
  return (
    <select name="category" id={id} defaultValue={defaultSelected} onChange={handleChange}>
      {categories.map((category) => (
        <option value={category} key={category}>
          {category}
        </option>
      ))}
    </select>
  );
}
