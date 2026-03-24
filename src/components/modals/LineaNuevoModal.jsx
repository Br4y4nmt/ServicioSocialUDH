import React from "react";
import { showTopWarningToast } from "../../hooks/alerts/useWelcomeToast";

function LineaNuevoModal({
  isOpen,
  nombreLinea,
  onChangeNombreLinea,
  onClose,
  onGuardar,
}) {
  if (!isOpen) return null;

  return (
    <div className="programas-modal show">
      <div className="programas-modal-content">
        <h3>Registrar Línea de Acción</h3>

        <input
          type="text"
          className="programas-modal-input"
          placeholder="Nombre de la línea"
          value={nombreLinea}
          onChange={(e) => onChangeNombreLinea(e.target.value)}
        />

        <div className="programas-modal-actions">
          <button
            className="docentes-btn cancelar"
            type="button"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="docentes-btn guardar"
            type="button"
            onClick={async () => {
              if (!nombreLinea || !nombreLinea.trim()) {
                showTopWarningToast('Campo requerido', 'Ingresa el nombre de la línea.');
                return;
              }

              await onGuardar();
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default LineaNuevoModal;
