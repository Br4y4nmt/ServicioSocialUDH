import React, { memo } from 'react';
import '../../components/docente/DashboardDocente.css';
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
          maxLength={1000}
          value={observacion}
          onChange={(e) => onObservacionChange(e.target.value)}
        />
        <div className="modal-observacion-actions">
          <button onClick={onCancelar} className="grupo-alumno-btn grupo-alumno-btn-cancel">
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!observacion || !observacion.trim()) {
                showTopWarningToast('Observación requerida', 'Por favor, escriba una observación antes de enviar.');
                return;
              }

              if (typeof onEnviar === 'function') onEnviar();
            }}
            className="grupo-alumno-btn grupo-alumno-btn-save"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
});

export default ModalObservacionConformidad;
