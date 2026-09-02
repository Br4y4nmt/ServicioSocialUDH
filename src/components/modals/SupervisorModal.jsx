import React, { useEffect, useState } from 'react';
import DeleteIcon from '../../hooks/componentes/Icons/DeleteIcon';

function SupervisorModal({
  isOpen,
  onClose,
  trabajo,
  agregandoIntegrante = false,
  onAgregarIntegrante,
  onEliminarIntegrante
}) {
  const [mostrarIntegrantes, setMostrarIntegrantes] = useState(false);
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [codigoNuevoIntegrante, setCodigoNuevoIntegrante] = useState('');
  const [integrantes, setIntegrantes] = useState([]);
  const [eliminandoIntegranteId, setEliminandoIntegranteId] = useState(null);

  useEffect(() => {
    if (isOpen && trabajo) {
      setMostrarIntegrantes(false);
      setMostrarAgregar(false);
      setCodigoNuevoIntegrante('');
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
  ).trim().toLowerCase();

  const esGrupal = tipoServicio === 'grupal';

  const estadoInformeFinal = String(
    trabajo.estado_informe_final || ''
  ).trim().toLowerCase();

  const puedeAgregarIntegrante =
    esGrupal && estadoInformeFinal === 'pendiente';

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
      minute: '2-digit'
    });
  };

  const handleCodigoChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,10}$/.test(value)) {
      setCodigoNuevoIntegrante(value);
    }
  };

  const handleAgregarIntegrante = async (e) => {
    e.preventDefault();

    if (!onAgregarIntegrante || !codigoNuevoIntegrante.trim()) return;

    const nuevoIntegrante = await onAgregarIntegrante(
      trabajo,
      codigoNuevoIntegrante.trim()
    );

    if (!nuevoIntegrante) return;

    setIntegrantes((prev) => {
      const existe = prev.some(
        (item) =>
          item.id_integrante === nuevoIntegrante.id_integrante ||
          item.codigo === nuevoIntegrante.codigo
      );

      if (existe) return prev;

      return [...prev, nuevoIntegrante];
    });

    setCodigoNuevoIntegrante('');
    setMostrarAgregar(false);
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
          (item) => item.id_integrante !== integranteId
        )
      );
    } finally {
      setEliminandoIntegranteId(null);
    }
  };

  const handleCerrar = () => {
    if (agregandoIntegrante || eliminandoIntegranteId) return;

    setMostrarAgregar(false);
    setCodigoNuevoIntegrante('');
    onClose();
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
                    setMostrarIntegrantes((prev) => !prev)
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
                <div className="supervisor-integrantes-title-row">
                  <h4>Integrantes del grupo</h4>

                  {puedeAgregarIntegrante && (
                    <button
                      type="button"
                      className={`supervisor-agregar-integrante-btn ${
                        mostrarAgregar ? 'activo' : ''
                      }`}
                      onClick={() => {
                        setMostrarAgregar((prev) => !prev);
                        setCodigoNuevoIntegrante('');
                      }}
                      disabled={agregandoIntegrante}
                    >
                      <span className="supervisor-agregar-integrante-icon">
                        +
                      </span>
                      Agregar
                    </button>
                  )}
                </div>

                <span>
                  {integrantes.length}{' '}
                  {integrantes.length === 1
                    ? 'integrante registrado'
                    : 'integrantes registrados'}
                </span>
              </div>
            </div>

            {puedeAgregarIntegrante && mostrarAgregar && (
              <form
                className="supervisor-agregar-integrante-form"
                onSubmit={handleAgregarIntegrante}
              >
                <div className="supervisor-agregar-integrante-field">
                  <label htmlFor="codigo-nuevo-integrante">
                    Código universitario
                  </label>

                  <div className="supervisor-agregar-integrante-control">
                    <input
                      id="codigo-nuevo-integrante"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={10}
                      value={codigoNuevoIntegrante}
                      onChange={handleCodigoChange}
                      placeholder="Ej. 2023110693"
                      disabled={agregandoIntegrante}
                      autoFocus
                    />

                    <button
                      type="submit"
                      disabled={
                        agregandoIntegrante ||
                        !codigoNuevoIntegrante.trim()
                      }
                    >
                      {agregandoIntegrante
                        ? 'Agregando...'
                        : 'Agregar integrante'}
                    </button>
                  </div>

                  <span className="supervisor-agregar-integrante-help">
                    Ingresa únicamente el código universitario del estudiante.
                  </span>
                </div>
              </form>
            )}

            {integrantes.length > 0 ? (
              <div className="supervisor-integrantes-list">
                {integrantes.map((integrante, index) => {
                  const nombreIntegrante = (
                    integrante.nombre_completo || 'SIN NOMBRE'
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
                        <strong>{nombreIntegrante}</strong>

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
                        disabled={
                          eliminando ||
                          agregandoIntegrante
                        }
                        onClick={() =>
                          handleEliminarIntegrante(integrante)
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
            onClick={handleCerrar}
            disabled={
              agregandoIntegrante ||
              !!eliminandoIntegranteId
            }
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SupervisorModal;