import React from "react";

function PlanIcon({ size = 32, color = "#2e9e7f", className = "" }) {
  return (
    <svg
      fill={color}
      height={size}
      width={size}
      viewBox="0 0 32 32"
      className={`transition-transform transform group-hover:translate-x-2 duration-300 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24,14.059V5.584L18.414,0H0v32h24v-0.059c4.499-0.5,7.998-4.309,8-8.941C31.998,18.366,28.499,14.556,24,14.059z M17.998,2.413L21.586,6h-3.588V2.413z M2,30V1.998h14v6.001h6v6.06c-1.752,0.194-3.352,0.89-4.652,1.941H4v2h11.517c-0.412,0.616-0.743,1.289-0.994,2H4v2h10.059C14.022,22.329,14,22.661,14,23c0,2.829,1.308,5.351,3.349,7H2z M23,29.883c-3.801-0.009-6.876-3.084-6.885-6.883c0.009-3.801,3.084-6.876,6.885-6.885c3.799,0.009,6.874,3.084,6.883,6.885C29.874,26.799,26.799,29.874,23,29.883z M20,12H4v2h16V12z"></path>
      
      <polygon points="22,27 19,27 19,24"></polygon>

      <rect
        height="4.243"
        width="7.071"
        x="20.464"
        y="19.879"
        transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 56.5269 20.5858)"
      ></rect>
    </svg>
  );
}

export default PlanIcon;
