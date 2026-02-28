import React from "react";

function InformesFinalesIcon({ size = 32, color = "#2e9e7f", className = "" }) {
  return (
    <svg
      viewBox="0 0 48 64"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 8h24l10 10v34a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z" />
      <path d="M34 8v10h10" />
      <line x1="16" y1="26" x2="34" y2="26" />
      <line x1="16" y1="34" x2="34" y2="34" />
      <line x1="16" y1="42" x2="28" y2="42" />
      <circle cx="38" cy="48" r="5" />
      <line x1="42" y1="52" x2="46" y2="56" />
    </svg>
  );
}

export default InformesFinalesIcon;