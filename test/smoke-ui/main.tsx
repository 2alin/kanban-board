import { createRoot } from "react-dom/client";
import Menu from "../../src/components/menu";

function print(text: string, target: EventTarget) {
  if (!(target instanceof HTMLElement)) {
    console.error("can't print, no target found");
    return;
  }

  const printContainer = target.closest("[data-print-id]");
  if(!(printContainer instanceof HTMLElement)) {
    console.error("can't print, no print container found");
    return;
  }

  const {printId} = printContainer.dataset
  if(!printId) {
    console.error("no print Id found")
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
      <section data-print-id="output-menu-default">
        <h3>Menu component (default)</h3>
        <p>
          Output: <span className="output" id="output-menu-default"></span>
        </p>
        <Menu
          options={[
            {
              key: "option-1",
              text: "option 1",
              handler: ({ target }) => print("clicked option 1", target),
            },
            {
              key: "option-2",
              text: "option 2",
              handler: ({ target }) => print("clicked option 2", target),
            },
            {
              key: "option-3",
              text: "option 3",
              handler: ({ target }) => print("clicked option 3", target),
            },
          ]}
        >
          Menu
        </Menu>
      </section>
      <section data-print-id="output-menu-top">
        <h3>Menu component (options at the top)</h3>
        <p>
          Output: <span className="output" id="output-menu-top"></span>
        </p>
        <Menu
          options={[
            {
              key: "option-1",
              text: "option 1",
              handler: ({ target }) => print("clicked option 1", target),
            },
            {
              key: "option-2",
              text: "option 2",
              handler: ({ target }) => print("clicked option 2", target),
            },
            {
              key: "option-3",
              text: "option 3",
              handler: ({ target }) => print("clicked option 3", target),
            },
          ]}
          optionsPosition="top"
        >
          Menu
        </Menu>
      </section>
    </>
  );
}

initialize();
