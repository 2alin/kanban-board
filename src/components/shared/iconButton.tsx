import "./iconButton.css";

import type { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export default function IconButton(props: IconButtonProps) {
  return (
    <button
      {...props}
      className={`icon ${props.className}`}
      aria-label={props.label}
    >
      <span className="icon-img"></span>
    </button>
  );
}
