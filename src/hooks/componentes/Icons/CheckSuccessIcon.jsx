import React from "react";

function CheckSuccessIcon({
  size = 20,
  color = "#38a169",
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
      <path d="M20.285 2.857L9 14.143 3.714 8.857 2.3 10.271 9 16.971l12-12z" />
    </svg>
  );
}

export default CheckSuccessIcon;
