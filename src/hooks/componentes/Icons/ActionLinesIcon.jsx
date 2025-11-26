import React from "react";

function ActionLinesIcon({ size = 22, color = "#2e9e7f", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="4" cy="6" r="1.5" />
      <line x1="8" y1="6" x2="20" y2="6" />

      <circle cx="4" cy="12" r="1.5" />
      <line x1="8" y1="12" x2="20" y2="12" />

      <circle cx="4" cy="18" r="1.5" />
      <line x1="8" y1="18" x2="20" y2="18" />
    </svg>
  );
}

export default ActionLinesIcon;
