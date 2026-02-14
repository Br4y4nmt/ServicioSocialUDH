import React, { memo } from 'react';
import '../../components/docente/DashboardDocente.css';

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
          <button onClick={onEnviar} className="enviar-btn">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
});

export default ModalObservacionConformidad;
