import React from "react";

function FacultyIcon({ size = 32, color = "#2e9e7f", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="32 8 6 20 32 32 58 20 32 8" />
      <line x1="10" y1="48" x2="54" y2="48" />
      <line x1="16" y1="48" x2="16" y2="28" />
      <line x1="26" y1="48" x2="26" y2="28" />
      <line x1="38" y1="48" x2="38" y2="28" />
      <line x1="48" y1="48" x2="48" y2="28" />
      <rect x="8" y="48" width="48" height="8" />
    </svg>
  );
}

export default FacultyIcon;
