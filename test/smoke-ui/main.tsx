import { createRoot } from "react-dom/client";
import MenuSection from "./menuSection";

function printTo(text: string, target: EventTarget) {
  if (!(target instanceof HTMLElement)) {
    console.error("can't print, no target found");
    return;
  }

  const printContainer = target.closest("[data-print-id]");
  if (!(printContainer instanceof HTMLElement)) {
    console.error("can't print, no print container found");
    return;
  }

  const { printId } = printContainer.dataset;
  if (!printId) {
    console.error("no print Id found");
    return;
  }

  const outputElement = document.getElementById(printId);
  if (!outputElement) {
    console.error("couldn't find the output element");
    return;
  }

  outputElement.textContent = text;
}

function initialize() {
  const rootContainer = document.getElementById("root");
  if (!rootContainer) {
    console.error("No root container found");
    return;
  }

  const root = createRoot(rootContainer);
  root.render(
    <>
      <header>
        <h1>Smoke tests page for UI components</h1>
      </header>
      <MenuSection printTo={printTo} />
    </>
  );
}

initialize();
