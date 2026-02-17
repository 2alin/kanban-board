import "./iconButton.css";

import type { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  className?: string;
}

export default function IconButton({
  label,
  className,
  ...forwardedProps
}: IconButtonProps) {
  return (
    <button
      {...forwardedProps}
      className={`icon ${className}`}
      aria-label={label}
    >
      <span className="icon-img"></span>
    </button>
  );
}
