import React from "react";

function EvidenciaCameraIcon({
  size = 20,
  color = "#685f4aff",
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={color}
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M21 5h-3.586l-1.707-1.707A.997.997 0 0 0 15 3H9a.997.997 0 0 0-.707.293L6.586 5H3
        c-1.103 0-2 .897-2 2v12a2 2 0 0 0 2 2h18c1.103 0 2-.897 2-2V7a2 2 0 0 0-2-2zm0
        14H3V7h4.586l1.707-1.707L9.999 5h4.002l1.707 1.707L16.414 7H21v12z" />
      <path d="M12 8a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
  );
}

export default EvidenciaCameraIcon;
