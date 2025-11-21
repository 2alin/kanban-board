import "./themeSelector.css";

import { themes } from "../defaultSettings";

interface ThemeSelectorProps {
  handleThemeChange: React.MouseEventHandler;
}

export default function ThemeSelector({
  handleThemeChange,
}: ThemeSelectorProps) {
  return (
    <section className="theme-selector">
      <span>Select theme: </span>
      {themes.map((theme) => (
        <button data-theme={theme} onClick={handleThemeChange} key={theme}>
          <span className="color-sample"></span>
          <span className="color-sample"></span>
          <span className="color-sample"></span>
          <span className="color-sample"></span>
        </button>
      ))}
    </section>
  );
}
