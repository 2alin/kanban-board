import { themes } from "../defaultSettings";

export default function ThemeSelector({ handleThemeChange }) {
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
