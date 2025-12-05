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
    <div className="modal-observacion-overlay">
      <div className="modal-observacion-content">
        <h3 style={{ marginBottom: "10px" }}>Observación del Docente</h3>
        <p style={{ color: "#4A5568" }}>{observacionSeleccionada}</p>

        <div className="modal-observacion-actions">
          <button
            className="modal-observacion-btn-volver-subir"
            onClick={() => onVolverASubir(actividadSeleccionada)}
            disabled={!actividadSeleccionada}
          >
            Volver a subir
          </button>
          <button
            className="modal-observacion-btn-cerrar-estudiante"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ObservacionEstudianteModal;
