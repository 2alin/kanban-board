import "./themeSelector.css";

import { themes } from "../defaultSettings";

interface ThemeSelectorProps {
  handleThemeChange: React.MouseEventHandler;
}

export default function ThemeSelector({
  handleThemeChange,
}: ThemeSelectorProps) {
  return (
    <article id="theme-select-section">
      <span>Select: </span>
      {themes.map((theme) => (
        <button data-theme={theme} onClick={handleThemeChange} key={theme}>
          <span className="color-sample"></span>
          <span className="color-sample"></span>
          <span className="color-sample"></span>
          <span className="color-sample"></span>
        </button>
      ))}
    </article>
  );
}
