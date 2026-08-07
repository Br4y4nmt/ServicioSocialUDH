import React, { memo } from 'react';
import ReactDOM from 'react-dom';
import VerBoton from '../../hooks/componentes/VerBoton';

const CronogramaActividadesDocenteModal = memo(function CronogramaActividadesDocenteModal({
  visible,
  cronogramaSeleccionado,
  isAprobando,
  onClose,
  onAprobar,
  onObservar,
  onVerEvidencia,
}) {
  if (!visible) return null;

  return ReactDOM.createPortal(
    <div className="modal-cronograma-overlay">
      <div className="modal-cronograma-content">
        <h3 className="modal-evidencia-title" style={{ textAlign: 'center' }}>
          Cronograma de Actividades
        </h3>

        {cronogramaSeleccionado.length > 0 ? (
          <div className="modal-cronograma-table-wrapper">
            <table className="modal-cronograma-table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Actividad</th>
                  <th>Justificación</th>
                  <th>Fecha</th>
                  <th>Fecha Fin</th>
                  <th>Resultados</th>
                  <th>Estado</th>
                  <th>Evidencia</th>
                </tr>
              </thead>
              <tbody>
                {cronogramaSeleccionado.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.actividad}</td>
                    <td>{item.justificacion}</td>
                    <td>{item.fecha}</td>
                    <td>{item.fecha_fin || 'No registrada'}</td>
                    <td>{item.resultados}</td>
                    <td>
                      {item.estado === 'aprobado' ? (
                        <button className="btn-estado-aprobado" disabled>
                          Aprobado
                        </button>
                      ) : item.estado === 'observado' ? (
                        <button className="btn-estado-observado" disabled>
                          Observado
                        </button>
                      ) : item.evidencia ? (
                        <div className="estado-acciones">
                          <button
                            className="btn-aprobar-estado"
                            disabled={isAprobando}
                            onClick={() => onAprobar(item.id)}
                          >
                            Aprobar
                          </button>
                          <button
                            className="btn-observar-estado"
                            disabled={isAprobando}
                            onClick={() => onObservar(item.id)}
                          >
                            Observar
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#aaa' }}>
                          Sin evidencia
                        </span>
                      )}
                    </td>
                    <td>
                      {item.evidencia ? (
                        <VerBoton onClick={() => onVerEvidencia(item.evidencia)} />
                      ) : (
                        <span style={{ fontSize: '12px', color: '#aaa' }}>
                          No enviada
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="modal-cronograma-empty">
            No hay cronograma disponible para este trabajo social.
          </p>
        )}

        <div className="modal-cronograma-actions">
          <button className="modal-evidencia-btn-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
});

export default CronogramaActividadesDocenteModal;