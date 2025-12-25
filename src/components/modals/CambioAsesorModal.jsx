import React from "react";

function CambioAsesorModal({
  visible,
  onClose,
  onSave,
  guardando,
  trabajoSeleccionado,
  asesores,
  asesorSeleccionado,
  setAsesorSeleccionado,
}) {
  if (!visible) return null;

  return (
    <div className="modal-tiempo-overlay">
      <div className="modal-tiempo-content">
        <h3>
          Cambiar asesor de{" "}
          <span style={{ color: "#2e9e7f" }}>
            {trabajoSeleccionado?.nombre_estudiante}
          </span>
        </h3>

        <label className="docentes-search-label" style={{ marginTop: "1rem" }}>
          Asesores disponibles:
          <select
            className="select-profesional"
            value={asesorSeleccionado}
            onChange={(e) => setAsesorSeleccionado(e.target.value)}
            disabled={guardando}
          >
            <option value="">Seleccione un asesor</option>
            {asesores.map((a) => (
              <option key={a.id_docente} value={a.id_docente}>
                {a.nombre_docente}
              </option>
            ))}
          </select>
        </label>

        <div className="modal-tiempo-footer">
          <button
            className="btn-cancelar-cambio-asesor"
            onClick={onClose}
            disabled={guardando}
          >
            Cancelar
          </button>

          <button
            className="btn-guardar-cambio-asesor"
            onClick={onSave}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar cambio"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CambioAsesorModal;
