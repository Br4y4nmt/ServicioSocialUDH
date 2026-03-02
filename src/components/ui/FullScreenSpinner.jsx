import React from "react";
import "./fullscreenSpinner.css";

function FullScreenSpinner({ text = "Cargando..." }) {
  return (
    <div className="fullscreen-spinner-overlay">

      <div className="fullscreen-spinner-box">

        <div className="fullscreen-spinner-ring"></div>

        {text && (
          <p className="fullscreen-spinner-text">
            {text}
          </p>
        )}

      </div>

    </div>
  );
}

export default FullScreenSpinner;