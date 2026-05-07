import React from "react";

function ObservacionEstudianteModal({
  visible,
  observacionSeleccionada,
  actividadSeleccionada,
  onVolverASubir,
  onClose,
}) {
  if (!visible) return null;

  return (
    <div className="motivo-rechazo-modal-overlay">
      <div className="motivo-rechazo-modal">
        <h3 className="motivo-rechazo-title">Observación del Docente</h3>

        <textarea
          className="motivo-rechazo-textarea"
          readOnly
          value={
            observacionSeleccionada ||
            "No hay observación disponible."
          }
        />

        <div className="motivo-rechazo-footer">
          <button
            className="grupo-alumno-btn grupo-alumno-btn-save"
            style={{fontSize: '14px'}}
            onClick={() => onVolverASubir(actividadSeleccionada)}
            disabled={!actividadSeleccionada}
          >
            Volver a subir
          </button>
          <button className="grupo-alumno-btn grupo-alumno-btn-cancel" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ObservacionEstudianteModal;
