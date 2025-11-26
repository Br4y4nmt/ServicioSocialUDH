import React from "react";

function SupervisorCheckIcon({ size = 18, color = "#2e9e7f", className = "" }) {
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
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a8.38 8.38 0 0113 0" />
      <path d="M16.5 11.5l1.5 1.5 3-3" /> 
    </svg>
  );
}

export default SupervisorCheckIcon;
