import React from "react";

const InfoCircleSVG = ({ width = 38, height = 46, style = {}, className = "", bg = "#4285f4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={width}
    height={height}
    style={style}
    className={className}
    fill="none"
  >
    <circle cx="256" cy="256" r="256" fill={bg} />
    <path
      d="M256 232c13.3 0 24 10.7 24 24v104c0 13.3-10.7 24-24 24s-24-10.7-24-24V256c0-13.3 10.7-24 24-24zm0-80c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32z"
      fill="#fff"
    />
  </svg>
);

export default InfoCircleSVG;
