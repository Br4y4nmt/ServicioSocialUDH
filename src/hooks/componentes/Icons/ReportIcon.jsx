import React from "react";

function ReportIcon({ size = 32, color = "#2e9e7f", className = "" }) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="3.036"
      className={`transition-transform transform group-hover:translate-x-2 duration-300 ${className}`}
    >
      <path d="M14,4.5H10.5a2,2,0,0,0-2,2v35a2,2,0,0,0,2,2h27a2,2,0,0,0,2-2V6.5a2,2,0,0,0-2-2H24"></path>
      <path d="M12,4.5l1.4142-1.4142A2,2,0,0,1,14.8284,2.5H23a1,1,0,0,1,1,1v25l-5-5-5,5V4.5"></path>
      <line x1="14" y1="38" x2="34" y2="38"></line>
      <line x1="24" y1="10" x2="34" y2="10"></line>
      <line x1="24" y1="17" x2="34" y2="17"></line>
      <line x1="24" y1="24" x2="34" y2="24"></line>
      <line x1="14" y1="31" x2="34" y2="31"></line>
    </svg>
  );
}

export default ReportIcon;
