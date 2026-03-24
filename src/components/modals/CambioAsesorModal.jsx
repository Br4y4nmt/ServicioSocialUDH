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
    <div className="programas-modal show">
      <div className="programas-modal-content">
        <h3>
          Cambiar asesor de{" "}
          <span style={{ color: "#2e9e7f" }}>
            {trabajoSeleccionado?.nombre_estudiante}
          </span>
        </h3>

        <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
          Asesores disponibles
        </label>
          <select
            className="programas-modal-select"
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

        <div className="programas-modal-actions">
          <button
            className="docentes-btn cancelar"
            onClick={onClose}
            disabled={guardando}
          >
            Cancelar
          </button>

          <button
            className="docentes-btn guardar"
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
