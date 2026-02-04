import "./iconButton.css";

import type { DragEventHandler, MouseEventHandler } from "react";

interface IconButtonProps {
  label: string;
  id?: string;
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  formAction?: (formData: FormData) => void | Promise<void>;
  draggable?: boolean;
  onDragStart?: DragEventHandler<HTMLButtonElement>;
}

export default function IconButton({
  label,
  id,
  className,
  type,
  disabled,
  onClick,
  formAction,
  draggable,
  onDragStart,
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      id={id}
      className={`icon ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
      formAction={formAction}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <span className="icon-img"></span>
    </button>
  );
}
