import React from "react";
import { createPortal } from "react-dom";

function ModalMotivoRechazoInforme({ visible, motivo, onClose }) {
  if (!visible) return null;

  return createPortal(
    <div className="motivo-rechazo-modal-overlay" onClick={onClose}>
      <div className="motivo-rechazo-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="motivo-rechazo-title">MOTIVO DEL RECHAZO</h3>

        <textarea
          className="motivo-rechazo-textarea"
          readOnly
          value={motivo || "No se encontró el motivo del rechazo."}
        />

        <div className="motivo-rechazo-footer">
          <button className="motivo-rechazo-btn-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ModalMotivoRechazoInforme;
