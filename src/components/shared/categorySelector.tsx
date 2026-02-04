import { useState } from "react";
import type { CategoryData } from "../../app.types";

interface CategorySelectorProps {
  categories: CategoryData[];
  defaultValue?: string;
  onChange?: (newValue: string) => void;
}

export default function CategorySelector({
  categories,
  defaultValue,
  onChange,
}: CategorySelectorProps) {
  const [selected, setSelected] = useState(defaultValue);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { target } = event;
    setSelected(target.value);

    if (onChange) {
      onChange(target.value);
    }
  }

  return (
    <select name="categoryIdx" value={selected} onChange={handleChange}>
      {categories.map((category, index) => (
        <option value={index} key={index}>
          {category.title}
        </option>
      ))}
    </select>
  );
}
