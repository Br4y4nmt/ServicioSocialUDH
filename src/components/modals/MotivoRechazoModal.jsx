import React from "react";
import { createPortal } from "react-dom";

function MotivoRechazoModal({ visible, motivo, onClose }) {
  if (!visible) return null;

  return createPortal(
    <div className="motivo-rechazo-modal-overlay">
      <div className="motivo-rechazo-modal">
        <h3 className="motivo-rechazo-title">MOTIVO DEL RECHAZO</h3>

        <textarea
          className="motivo-rechazo-textarea"
          readOnly
          value={
            motivo ||
            "Ocurrió un error al cargar el motivo de rechazo. Inténtelo más tarde."
          }
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

export default MotivoRechazoModal;
