import React from "react";

function SocialServiceIcon({ size = 18, color = "#2e9e7f", className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      stroke={color}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      className={className}
    >
      <path d="M3 15c1.5 2 5.5 2 7 0l2-2 2 2c1.5 2 5.5 2 7 0" />
      <path d="M12 8.5l-1.1-1.1a3 3 0 10-4.2 4.2L12 17l5.3-5.4a3 3 0 00-4.2-4.2L12 8.5z" />
    </svg>
  );
}

export default SocialServiceIcon;
