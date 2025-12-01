// src/components/modals/GrupoDocenteModal.jsx
import React from "react";

function GrupoDocenteModal({
  visible,
  integrantesGrupo,
  onClose,
}) {
  if (!visible) return null;

  return (
    <div className="modal-grupo-overlay">
      <div className="modal-grupo-content">
        <h3 className="modal-grupo-title">Integrantes del Grupo</h3>

        <ul className="modal-grupo-lista">
          {integrantesGrupo.length > 0 ? (
            integrantesGrupo.map((integrante, index) => (
              <li key={index} className="modal-grupo-item">
                <span
                  className="modal-grupo-correo"
                  style={{ display: "inline" }}
                >
                  {integrante.correo}
                </span>
                <span style={{ display: "inline" }}> - </span>
                <span
                  className="modal-grupo-nombre"
                  style={{ display: "inline" }}
                >
                  {integrante.nombre && integrante.nombre !== "NO ENCONTRADO"
                    ? integrante.nombre
                    : "NOMBRE NO DISPONIBLE"}
                </span>
              </li>
            ))
          ) : (
            <li className="modal-grupo-vacio">
              No hay integrantes registrados.
            </li>
          )}
        </ul>

        <div className="modal-grupo-actions">
          <button
            className="modal-grupo-btn cerrar"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default GrupoDocenteModal;
