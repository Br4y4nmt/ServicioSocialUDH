import React from "react";

function LaborNuevoModal({
  isOpen,
  nombreLabor,
  onChangeNombreLabor,
  lineaLabor,
  onChangeLineaLabor,
  lineas = [],
  onClose,
  onGuardar,
}) {
  if (!isOpen) return null;

  return (
    <div className="labores-modal show">
      <div className="labores-modal-content">
        <h3>Registrar Servicio Social</h3>

        <input
          type="text"
          className="labores-modal-input"
          placeholder="Nombre del servicio social"
          value={nombreLabor}
          onChange={(e) => onChangeNombreLabor(e.target.value)}
        />

        <select
          className="labores-modal-select"
          value={lineaLabor}
          onChange={(e) => onChangeLineaLabor(e.target.value)}
        >
          <option value="">-- Línea de Acción --</option>
          {lineas.map((linea) => (
            <option key={linea.id_linea} value={linea.id_linea}>
              {linea.nombre_linea}
            </option>
          ))}
        </select>

        <div className="labores-modal-actions">
          <button
            className="labores-btn cancelar"
            type="button"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="labores-btn guardar"
            type="button"
            onClick={onGuardar}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default LaborNuevoModal;
