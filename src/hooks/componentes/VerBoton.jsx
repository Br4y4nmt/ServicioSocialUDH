import React from "react";
import "./VerBoton.css";

function VerBoton({ onClick, label = "Ver" }) {
  return (
    <button className="btn-ojo-ver-plan-docente" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 
          12c-2.761 0-5-2.239-5-5s2.239-5 
          5-5 5 2.239 5 5-2.239 5-5 5zm0-8a3 3 0 1 0 0 6 
          3 3 0 0 0 0-6z" />
      </svg>
      <span className="texto-ver-docente">&nbsp;{label}</span>
    </button>
  );
}

function VerBotonInline({ onClick, label = "Ver" }) {
  return (
    <button className="btn-ver-documento-inline" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 
          12c-2.761 0-5-2.239-5-5s2.239-5 
          5-5 5 2.239 5 5-2.239 5-5 5zm0-8a3 3 0 1 0 0 6 
          3 3 0 0 0 0-6z" />
      </svg>
      <span className="texto-ver-docente">&nbsp;{label}</span>
    </button>
  );
}

export default VerBoton;
export { VerBotonInline };
