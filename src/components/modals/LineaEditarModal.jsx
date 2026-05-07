import React, { useState, useEffect } from "react";
import { showTopWarningToast } from "../../hooks/alerts/useWelcomeToast";

function LineaEditarModal({
  isOpen,
  nombreLinea,
  onChangeNombreLinea,
  onClose,
  onGuardar,
}) {
  const [initialNombre, setInitialNombre] = useState('');

  useEffect(() => {
    if (isOpen) setInitialNombre((nombreLinea || '').trim());
  }, [isOpen, nombreLinea]);

  if (!isOpen) return null;

  return (
    <div className="programas-modal show">
      <div className="programas-modal-content">
        <h3>Editar línea de acción</h3>

        <input
          type="text"
          className="programas-modal-input"
          placeholder="Nombre de la línea"
          value={nombreLinea}
          onChange={(e) => onChangeNombreLinea(e.target.value)}
        />

        <div className="programas-modal-actions">
          <button
            className="grupo-alumno-btn grupo-alumno-btn-cancel"
            type="button"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="grupo-alumno-btn grupo-alumno-btn-save"
            type="button"
            onClick={async () => {
              const actual = (nombreLinea || '').trim();
              if (actual === (initialNombre || '')) {
                showTopWarningToast('Sin cambios', 'No se realizaron cambios.');
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

export default LineaEditarModal;
