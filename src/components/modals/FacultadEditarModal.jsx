import React from "react";
import { showTopWarningToast } from '../../hooks/alerts/useWelcomeToast';

function FacultadEditarModal({
  isOpen,
  nombre,
  originalNombre,
  onChangeNombre,
  onCancelar,
  onGuardar,
}) {
  if (!isOpen) return null;

  return (
    <div className="facultades-modal show">
      <div className="facultades-modal-content">
        <h3>Editar Facultad</h3>
        <input
          type="text"
          className="facultades-modal-input"
          placeholder="Nuevo nombre de la facultad"
          value={nombre}
          onChange={(e) => onChangeNombre(e.target.value)}
        />
        <div className="facultades-modal-actions">
          <button
            className="docentes-btn cancelar"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button
            className="docentes-btn guardar"
            onClick={() => {
              if ((originalNombre || '').trim() === (nombre || '').trim()) {
                showTopWarningToast('Sin cambios', 'No se realizaron cambios.');
                return;
              }

              onGuardar();
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacultadEditarModal;
