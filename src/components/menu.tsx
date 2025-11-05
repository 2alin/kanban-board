import React, { useEffect, useId, useRef, useState } from "react";

interface Option {
  key: string;
  text: string;
  handler: (event: React.MouseEvent) => void;
}

interface MenuProps {
  options: Option[];
  isIconButton?: boolean;
  positionX?: string;
  positionY?: string;
}

export default function Menu({
  options,
  isIconButton,
  positionX,
  positionY,
  children,
}: React.PropsWithChildren<MenuProps>) {
  const postfixId = useId();
  const componentRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLMenuElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  function focusFirstOption() {
    const optionsList = optionsRef.current;
    if (!optionsList) {
      return;
    }

    const buttons = optionsList.querySelectorAll(".option button");
    const firstButton = buttons[0];

    if (!(firstButton instanceof HTMLElement)) {
      return;
    }

    firstButton.focus();
  }

  function toggleIsOpen(value?: boolean) {
    const newValue = value !== undefined ? value : !isOpen;

    setIsOpen(newValue);
  }

  function handleClick(event: React.MouseEvent) {
    const { target } = event;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const actionElement = target.closest("[data-action]");

    if (!(actionElement instanceof HTMLElement)) {
      return;
    }

    const { action } = actionElement.dataset;

    switch (action) {
      case "toggle-open":
        toggleIsOpen();
        break;
      case "option-selected":
        // option behaviour is handled outside of the component
        toggleIsOpen(false);
        anchorRef.current?.focus();
        break;
      default:
      // nothing to do here
    }
  }

  function focusNext() {
    const optionsList = optionsRef.current;
    if (!optionsList) {
      return;
    }

    const { activeElement } = document;
    if (!activeElement) {
      focusFirstOption();
      return;
    }

    const buttons = optionsList.querySelectorAll(".option button");
    const currentFocusIdx = [...buttons].findIndex(
      (button) => button === activeElement
    );

    const nextFocusIdx = (currentFocusIdx + 1) % buttons.length;

    const nextButton = buttons[nextFocusIdx];
    if (!(nextButton instanceof HTMLElement)) {
      return;
    }
    nextButton.focus();
  }

  function focusPrevious() {
    const optionsList = optionsRef.current;
    if (!optionsList) {
      return;
    }

    const { activeElement } = document;
    if (!activeElement) {
      focusFirstOption();
      return;
    }

    const buttons = optionsList.querySelectorAll(".option button");
    const currentFocusIdx = [...buttons].findIndex(
      (button) => button === activeElement
    );

    const prevFocusIdx =
      (currentFocusIdx - 1 + buttons.length) % buttons.length;

    const prevButton = buttons[prevFocusIdx];
    if (!(prevButton instanceof HTMLElement)) {
      return;
    }
    prevButton.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (!isOpen) {
      // component shouldn't handle keyboard events if it's not opened
      return;
    }

    event.stopPropagation();
    const { key } = event;

    switch (key) {
      // 'Enter' case is handled by the 'click' event handler
      case "Tab":
        // 'tab' doesn't focus element options but it will close the menu
        // so the user can continue  navigating through the document
        event.preventDefault();
        toggleIsOpen(false);
        anchorRef.current?.focus();
        break;
      case "Escape":
        toggleIsOpen(false);
        anchorRef.current?.focus();
        break;
      case "ArrowDown":
        focusNext();
        break;
      case "ArrowUp":
        focusPrevious();
        break;
      default:
      // nothing to do here
    }
  }

  function getBestPosition() {
    const anchorElement = anchorRef.current;
    if (!anchorElement) {
      return;
    }

    const rect = anchorElement.getBoundingClientRect();
    const spaceTop = rect.top;
    const spaceBottom = window.innerHeight - rect.bottom;
    if (spaceBottom < spaceTop) {
      return "top";
    } else {
      return "bottom";
    }
  }

  useEffect(() => {
    // whenever the menu opens, it should focus in the first option
    if (isOpen) {
      focusFirstOption();
    }

    // handle clicks outside of the component
    addEventListener("click", (event: PointerEvent) => {
      const { target } = event;

      if (!(target instanceof HTMLElement) || !componentRef.current) {
        return;
      }

      const closestComponentElement = target.closest(".menu-component");

      if (isOpen && componentRef.current !== closestComponentElement) {
        toggleIsOpen(false);
      }
    });
  }, [isOpen]);

  return (
    <div
      className="menu-component"
      data-position-x={positionX}
      data-position-y={positionY || getBestPosition()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      ref={componentRef}
    >
      <button
        id={"anchor" + postfixId}
        className={`anchor ${isIconButton && "icon"}`}
        data-action="toggle-open"
        ref={anchorRef}
        aria-haspopup={true}
        aria-controls={"menu" + postfixId}
      >
        {isIconButton ? <span className="icon-img" /> : children}
      </button>
      <div className="options container">
        <menu
          hidden={!isOpen}
          id={"menu" + postfixId}
          className="options list"
          ref={optionsRef}
          aria-labelledby={"anchor" + postfixId}
        >
          {options.map(({ key, text, handler }) => (
            <li key={key} className="option" role="presentation">
              <button
                data-key={key}
                onClick={handler}
                data-action="option-selected"
                role="menuitem"
              >
                {text}
              </button>
            </li>
          ))}
        </menu>
      </div>
    </div>
  );
}
