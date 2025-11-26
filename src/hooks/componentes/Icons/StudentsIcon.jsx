import React from "react";

function StudentsIcon({ size = 18, color = "#2e9e7f", className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 12l-10 6L2 12l10-6 10 6z" />
      <path d="M6 12v5c0 .6.4 1.2 1 1.5l5 2.5 5-2.5c.6-.3 1-.9 1-1.5v-5" />
    </svg>
  );
}

export default StudentsIcon;
