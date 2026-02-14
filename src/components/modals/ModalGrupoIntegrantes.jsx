import React, { memo } from 'react';
import '../../components/docente/DashboardDocente.css';

const ModalGrupoIntegrantes = memo(function ModalGrupoIntegrantes({
  visible,
  integrantes = [],
  nombresMiembros = [],
  onCerrar
}) {
  if (!visible) return null;

  const obtenerNombre = (correo) => {
    const encontrado = nombresMiembros.find(
      n => n.correo?.toLowerCase().trim() === correo.toLowerCase().trim()
    );
    return encontrado && encontrado.nombre && encontrado.nombre !== 'NO ENCONTRADO'
      ? encontrado.nombre
      : 'NOMBRE NO DISPONIBLE';
  };

  return (
    <div className="modal-grupo-overlay">
      <div className="modal-grupo-content">
        <h3 className="modal-grupo-title">Integrantes del Grupo</h3>
        <ul className="modal-grupo-lista">
          {integrantes.length > 0 ? (
            integrantes.map((integrante, index) => (
              <li key={index}>
                <span className="modal-grupo-correo" style={{ display: 'inline' }}>
                  {integrante.correo_institucional}
                </span>
                <span style={{ display: 'inline' }}> - </span>
                <span className="modal-grupo-nombre">
                  {obtenerNombre(integrante.correo_institucional)}
                </span>
              </li>
            ))
          ) : (
            <li className="modal-grupo-vacio">No hay integrantes registrados.</li>
          )}
        </ul>
        <div className="modal-grupo-actions">
          <button className="modal-grupo-btn cerrar" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
});

export default ModalGrupoIntegrantes;
