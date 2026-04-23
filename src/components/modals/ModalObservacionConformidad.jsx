import React, { memo } from 'react';
import '../../components/docente/DashboardDocente.css';
import { alertconfirmacion } from '../../hooks/alerts/alertas';
import { showTopWarningToast } from '../../hooks/alerts/useWelcomeToast';

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
              if (!observacion || !observacion.trim()) {
                showTopWarningToast('Observación requerida', 'Por favor, escriba una observación antes de enviar.');
                return;
              }

              const confirm = await alertconfirmacion({
                title: '¿Está seguro de enviar esta observación?',
                text: 'Esta acción registrará la observación y continuará con el flujo.',
                icon: 'warning',
                confirmButtonColor: '#39B49E',
                cancelButtonColor: '#003366',
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
