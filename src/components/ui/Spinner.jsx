import React from "react";
import "./spinner.css";

function Spinner({ text, size = 20 }) {
  return (
    <div className="spinner-modern">
      <span
        className="spinner-modern-ring"
        style={{ width: size, height: size }}
      ></span>

      {text && (
        <span className="spinner-modern-text">
          {text}
        </span>
      )}
    </div>
  );
}

export default Spinner;