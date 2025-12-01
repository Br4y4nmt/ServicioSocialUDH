// src/components/modals/ProyectoModal.jsx
import React from "react";

function ProyectoModal({
  visible,
  proyectoFile,
  pdfGenerado,
  onFileChange,
  onClose,
  onCancel,
}) {
  if (!visible) return null;

  return (
    <div className="modal-overlay-alumno">
      <div className="modal-content-alumno">
        <h3>Subir Proyecto</h3>

        <input
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
        />

        {proyectoFile && (
          <p>Archivo seleccionado: {proyectoFile.name}</p>
        )}

        {pdfGenerado && (
          <div>
            <h4>PDF Generado</h4>
            <a
              href={pdfGenerado}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver PDF generado
            </a>
          </div>
        )}

        <div className="modal-actions-alumno">
          <button onClick={onClose}>Aceptar</button>

          <button onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProyectoModal;
