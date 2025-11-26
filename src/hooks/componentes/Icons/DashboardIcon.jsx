import React from "react";

function DashboardIcon({ size = 20, color = "#2e9e7f", className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
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
      <rect x="3" y="3" width="18" height="11" rx="1.5" />
      <path d="M6 13l4-4 3 3 5-5" />
      <path d="M12 14v5" />
      <path d="M8 21l4-5 4 5" />
    </svg>
  );
}

export default DashboardIcon;
