import Menu from "../../src/components/shared/menu";

interface MenuSectionProps {
  printTo: (text: string, target: EventTarget) => void;
}

export default function MenuSection({ printTo }: MenuSectionProps) {
  return (
    <>
      <article data-print-id="output-menu-default">
        <h3>Menu component (default)</h3>
        <p>
          Output: <span className="output" id="output-menu-default"></span>
        </p>
        <Menu
          options={[
            {
              key: "option-1",
              text: "option 1",
              handler: ({ target }) => printTo("clicked option 1", target),
            },
            {
              key: "option-2",
              text: "option 2",
              handler: ({ target }) => printTo("clicked option 2", target),
            },
            {
              key: "option-3",
              text: "option 3",
              handler: ({ target }) => printTo("clicked option 3", target),
            },
          ]}
        >
          Menu
        </Menu>
      </article>
      <article data-print-id="output-menu-top">
        <h3>Menu component (position Y: top)</h3>
        <p>
          Output: <span className="output" id="output-menu-top"></span>
        </p>
        <Menu
          options={[
            {
              key: "option-1",
              text: "option 1",
              handler: ({ target }) => printTo("clicked option 1", target),
            },
            {
              key: "option-2",
              text: "option 2",
              handler: ({ target }) => printTo("clicked option 2", target),
            },
            {
              key: "option-3",
              text: "option 3",
              handler: ({ target }) => printTo("clicked option 3", target),
            },
          ]}
          positionY="top"
        >
          Menu
        </Menu>
      </article>
      <article data-print-id="output-menu-right">
        <h3>Menu component (positionX: right)</h3>
        <p>
          Output: <span className="output" id="output-menu-right"></span>
        </p>
        <Menu
          options={[
            {
              key: "option-1",
              text: "option 1",
              handler: ({ target }) => printTo("clicked option 1", target),
            },
            {
              key: "option-2",
              text: "option 2",
              handler: ({ target }) => printTo("clicked option 2", target),
            },
            {
              key: "option-3",
              text: "option 3",
              handler: ({ target }) => printTo("clicked option 3", target),
            },
          ]}
          positionX="right"
        >
          Menu
        </Menu>
      </article>
      <article data-print-id="output-menu-top-right">
        <h3>Menu component (position Y: top, positionX: right)</h3>
        <p>
          Output: <span className="output" id="output-menu-top-right"></span>
        </p>
        <Menu
          options={[
            {
              key: "option-1",
              text: "option 1",
              handler: ({ target }) => printTo("clicked option 1", target),
            },
            {
              key: "option-2",
              text: "option 2",
              handler: ({ target }) => printTo("clicked option 2", target),
            },
            {
              key: "option-3",
              text: "option 3",
              handler: ({ target }) => printTo("clicked option 3", target),
            },
          ]}
          positionY="top"
          positionX="right"
        >
          Menu
        </Menu>
      </article>
    </>
  );
}
