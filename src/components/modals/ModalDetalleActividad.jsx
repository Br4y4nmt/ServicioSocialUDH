import React, { memo } from 'react';
import ReactDOM from 'react-dom';
import '../ModalGlobal.css';

const ModalDetalleActividad = memo(function ModalDetalleActividad({
  actividad,
  onCerrar
}) {
  if (!actividad) return null;

  return ReactDOM.createPortal(
    <div className="detalle-actividad-overlay">
      <div className="detalle-actividad-modal">
        <h3>Detalle de Actividad</h3>
        <p><strong>Actividad:</strong> {actividad.actividad}</p>
        <p><strong>Justificación:</strong> {actividad.justificacion}</p>
        <p><strong>Fecha Inicio:</strong> {actividad.fecha}</p>
        <p>
          <strong>Fecha Fin Permitida:</strong>{' '}
          {actividad.fecha_fin_primero
            ? actividad.fecha_fin_primero.substring(0, 10)
            : 'No asignada'}
        </p>
        <p><strong>Fecha Término:</strong> {actividad.fecha_fin || 'Sin completar'}</p>
        <p><strong>Resultados Esperados:</strong> {actividad.resultados}</p>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="detalle-actividad-btn-cerrar" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
});

export default ModalDetalleActividad;
