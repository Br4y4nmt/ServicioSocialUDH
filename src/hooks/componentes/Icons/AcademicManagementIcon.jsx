import React from "react";

function AcademicManagementIcon({ size = 28, color = "#2e9e7f", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Birrete */}
      <path d="M2 7l10-4 10 4-10 4-10-4zm10 6c-3.314 0-6-1.567-6-3.5v3.75c0 .414.336.75.75.75h10.5c.414 0 .75-.336.75-.75V9.5c0 1.933-2.686 3.5-6 3.5zm5-2.75v4.064A2.99 2.99 0 0 1 19 17v4a1 1 0 1 1-2 0v-4a1 1 0 1 0-2 0v4a1 1 0 1 1-2 0v-4a2.99 2.99 0 0 1 2-2.686V10.25l2-.75z" />
    </svg>
  );
}

export default AcademicManagementIcon;
