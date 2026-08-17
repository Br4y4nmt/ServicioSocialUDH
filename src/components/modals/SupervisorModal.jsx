import React, { useEffect, useState } from 'react';
import DeleteIcon from '../../hooks/componentes/Icons/DeleteIcon';

function SupervisorModal({
  isOpen,
  onClose,
  trabajo,
  onEliminarIntegrante,
}) {
  const [mostrarIntegrantes, setMostrarIntegrantes] = useState(false);
  const [integrantes, setIntegrantes] = useState([]);
  const [eliminandoIntegranteId, setEliminandoIntegranteId] = useState(null);

    useEffect(() => {
    if (isOpen && trabajo) {
        setMostrarIntegrantes(false);

        setIntegrantes(
        Array.isArray(trabajo.integrantes_grupo)
            ? trabajo.integrantes_grupo
            : []
        );

        setEliminandoIntegranteId(null);
    }
    }, [isOpen, trabajo]);

  if (!isOpen || !trabajo) return null;

  const nombreEstudiante = (
    trabajo.Estudiante?.nombre_estudiante || 'SIN NOMBRE'
  ).toUpperCase();

  const tipoServicio = (
    trabajo.tipo_servicio_social || 'individual'
  )
    .trim()
    .toLowerCase();

  const esGrupal = tipoServicio === 'grupal';

  const formatearFecha = (fecha) => {
    if (!fecha) return 'SIN FECHA';

    const fechaObj = new Date(fecha);

    if (Number.isNaN(fechaObj.getTime())) {
      return 'FECHA NO VÁLIDA';
    }

    return fechaObj.toLocaleString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEliminarIntegrante = async (integrante) => {
    if (!onEliminarIntegrante) return;

    const integranteId = integrante?.id_integrante;

    if (!integranteId) return;

    try {
      setEliminandoIntegranteId(integranteId);

      const eliminado = await onEliminarIntegrante(
        integrante,
        trabajo
      );

      if (!eliminado) return;

      setIntegrantes((prev) =>
        prev.filter(
          (item) =>
            item.id_integrante !== integranteId
        )
      );
    } finally {
      setEliminandoIntegranteId(null);
    }
  };

  return (
    <div className="programas-modal show">
      <div className="programas-modal-content supervisor-info-modal">

        <div className="supervisor-info-header">
          <div>
            <span className="supervisor-info-eyebrow">
              Servicio Social
            </span>

            <h3>Detalle del trabajo social</h3>
          </div>
        </div>

        <div className="supervisor-info-grid">
          <div className="supervisor-info-card supervisor-info-card-full">
            <span className="supervisor-info-label">
              Estudiante principal
            </span>

            <strong className="supervisor-info-value">
              {nombreEstudiante}
            </strong>
          </div>

          <div className="supervisor-info-card">
            <span className="supervisor-info-label">
              Fecha de creación
            </span>

            <strong className="supervisor-info-value">
              {formatearFecha(trabajo.createdAt)}
            </strong>
          </div>

          <div className="supervisor-info-card">
            <span className="supervisor-info-label">
              Tipo de trabajo social
            </span>

            <div className="supervisor-info-type-row">
              <span
                className={`supervisor-tipo-badge ${
                  esGrupal ? 'grupal' : 'individual'
                }`}
              >
                {esGrupal ? 'Grupal' : 'Individual'}
              </span>

              {esGrupal && (
                <button
                  type="button"
                  className="supervisor-ver-integrantes-btn"
                  onClick={() =>
                    setMostrarIntegrantes(
                      (prev) => !prev
                    )
                  }
                >
                  {mostrarIntegrantes
                    ? 'Ocultar'
                    : `Ver integrantes (${integrantes.length})`}
                </button>
              )}
            </div>
          </div>

        </div>

        {esGrupal && mostrarIntegrantes && (
          <div className="supervisor-integrantes-section">

            <div className="supervisor-integrantes-header">
              <div>
                <h4>Integrantes del grupo</h4>

                <span>
                  {integrantes.length}{' '}
                  {integrantes.length === 1
                    ? 'integrante registrado'
                    : 'integrantes registrados'}
                </span>
              </div>
            </div>

            {integrantes.length > 0 ? (
              <div className="supervisor-integrantes-list">

                {integrantes.map((integrante, index) => {
                  const nombreIntegrante = (
                    integrante.nombre_completo ||
                    'SIN NOMBRE'
                  ).toUpperCase();

                  const eliminando =
                    eliminandoIntegranteId ===
                    integrante.id_integrante;

                  return (
                    <div
                      className="supervisor-integrante-item"
                      key={
                        integrante.id_integrante ||
                        `${trabajo.id}-${index}`
                      }
                    >
                      <div className="supervisor-integrante-info">

                        <strong>
                          {nombreIntegrante}
                        </strong>

                        <div className="supervisor-integrante-meta">

                          {integrante.codigo && (
                            <span>
                              Código: {integrante.codigo}
                            </span>
                          )}

                          {integrante.programa_academico && (
                            <span>
                              {integrante.programa_academico}
                            </span>
                          )}

                        </div>
                      </div>

                      <button
                        type="button"
                        className="facultades-btn eliminar"
                        title={`Eliminar a ${nombreIntegrante}`}
                        aria-label={`Eliminar integrante ${nombreIntegrante}`}
                        disabled={eliminando}
                        onClick={() =>
                          handleEliminarIntegrante(
                            integrante
                          )
                        }
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  );
                })}

              </div>
            ) : (
              <div className="supervisor-integrantes-empty">
                No hay integrantes registrados en este grupo.
              </div>
            )}

          </div>
        )}

        <div className="programas-modal-actions supervisor-modal-actions">
          <button
            className="grupo-alumno-btn grupo-alumno-btn-cancel"
            type="button"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}

export default SupervisorModal;