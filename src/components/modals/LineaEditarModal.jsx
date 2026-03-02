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
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="labores-modal show">
      <div className="labores-modal-content">
        <h3>Editar Línea de Acción</h3>

        <input
          type="text"
          className="labores-modal-input"
          placeholder="Nombre de la línea"
          value={nombreLinea}
          onChange={(e) => onChangeNombreLinea(e.target.value)}
        />

        <div className="labores-modal-actions">
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
