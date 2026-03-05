import React, { memo } from 'react';
import '../../components/docente/DashboardDocente.css';
import { alertconfirmacion } from '../../hooks/alerts/alertas';

const ModalObservacionConformidad = memo(function ModalObservacionConformidad({
  visible,
  observacion,
  onObservacionChange,
  onCancelar,
  onEnviar
}) {
  if (!visible) return null;

  return (
    <div className="modal-observacion-overlay">
      <div className="modal-observacion-content">
        <h3>ESCRIBA EL MOTIVO DE SU DECISIÓN</h3>
        <textarea
          id="observacion-declinar"
          placeholder="Escriba aquí su observación..."
          maxLength={300}
          value={observacion}
          onChange={(e) => onObservacionChange(e.target.value)}
        />
        <div className="modal-observacion-actions">
          <button onClick={onCancelar} className="cancelar-btn">
            Cancelar
          </button>
          <button
            onClick={async () => {
              const confirm = await alertconfirmacion({
                title: '¿Está seguro de enviar esta observación?',
                text: 'Esta acción registrará la observación y continuará con el flujo.',
                icon: 'warning',
                confirmButtonColor: '#003366',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, enviar',
                cancelButtonText: 'Cancelar'
              });

              if (confirm?.isConfirmed) {
                if (typeof onEnviar === 'function') onEnviar();
              }
            }}
            className="enviar-btn"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
});

export default ModalObservacionConformidad;
