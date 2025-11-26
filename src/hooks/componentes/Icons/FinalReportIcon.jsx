import React from "react";

function FinalReportIcon({ size = 18, color = "#2e9e7f", className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      strokeWidth="2"
      className={className}
    >
      <path d="M7 8h10" />
      <path d="M7 12h4" />
      <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
    </svg>
  );
}

export default FinalReportIcon;
