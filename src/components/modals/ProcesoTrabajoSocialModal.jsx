import React from 'react';
import CalendarEmptyIcon from '../../hooks/componentes/Icons/CalendarEmptyIcon';

function ProcesoTrabajoSocialModal({
  isOpen,
  onClose,
  proceso,
  cargando,
  error,
}) {
  if (!isOpen) return null;

  const limitarPalabras = (texto, limite = 5) => {
    if (!texto) {
      return 'SIN DESCRIPCIÓN';
    }

    const palabras = texto
      .toString()
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (palabras.length <= limite) {
      return palabras.join(' ');
    }

    return `${palabras.slice(0, limite).join(' ')}...`;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '—';

    // Evitar desfases de zona horaria para DATEONLY
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      const [anio, mes, dia] = fecha.split('-');

      return `${dia}/${mes}/${anio}`;
    }

    const fechaObj = new Date(fecha);

    if (Number.isNaN(fechaObj.getTime())) {
      return '—';
    }

    return fechaObj.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatearFechaHora = (fecha) => {
    if (!fecha) return '—';

    const fechaObj = new Date(fecha);

    if (Number.isNaN(fechaObj.getTime())) {
      return '—';
    }

    return fechaObj.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const obtenerPlazo = (estado) => {
    const estados = {
      a_tiempo: {
        label: 'A tiempo',
        clase: 'a-tiempo',
      },

      vencido: {
        label: 'Vencido',
        clase: 'vencido',
      },

      aun_no_habilitado: {
        label: 'Aún no habilitado',
        clase: 'no-habilitado',
      },

      sin_fecha: {
        label: 'Sin fecha',
        clase: 'sin-fecha',
      },
    };

    return estados[estado] || estados.sin_fecha;
  };

  const obtenerEvidencia = (estado) => {
    const estados = {
      aceptado: {
        label: 'Aceptado',
        clase: 'aceptado',
      },

      pendiente: {
        label: 'Pendiente',
        clase: 'pendiente',
      },

      observado: {
        label: 'Observado',
        clase: 'observado',
      },

      no_enviado: {
        label: 'No enviado',
        clase: 'no-enviado',
      },
    };

    return estados[estado] || estados.no_enviado;
  };

  const actividades = Array.isArray(
    proceso?.actividades
  )
    ? proceso.actividades
    : [];

  const nombreEstudiante =
    proceso?.trabajo?.estudiante?.nombre_estudiante
      ? proceso.trabajo.estudiante.nombre_estudiante.toUpperCase()
      : '';

  return (
    <div className="programas-modal show">
      <div className="programas-modal-content proceso-trabajo-modal">

        <div className="proceso-trabajo-header">
          <span className="supervisor-info-eyebrow">
            Servicio Social
          </span>

          <h3>
            Proceso del trabajo social
          </h3>
        </div>

        {cargando && (
          <div className="proceso-trabajo-loading">
            <div className="proceso-trabajo-spinner" />

            <span>
              Cargando cronograma de actividades...
            </span>
          </div>
        )}
        {!cargando && error && (
          <div className="proceso-trabajo-error">
            {error}
          </div>
        )}

        {!cargando && !error && (
          <>

            {proceso && (
              <div className="proceso-trabajo-resumen">
                <div className="proceso-trabajo-resumen-item">
                  <span>
                    Estudiante principal
                  </span>

                  <strong>
                    {nombreEstudiante ||
                      'SIN NOMBRE'}
                  </strong>
                </div>

                <div className="proceso-trabajo-resumen-item">
                  <span>
                    Total de actividades
                  </span>

                  <strong>
                    {actividades.length}
                  </strong>
                </div>
              </div>
            )}
            {actividades.length === 0 ? (
              <div className="proceso-trabajo-vacio">
                <div className="proceso-trabajo-vacio-icon">
                  <CalendarEmptyIcon />
                </div>

                <div className="proceso-trabajo-vacio-contenido">
                  <strong>
                    El estudiante no tiene actividades registradas
                  </strong>

                  <span>
                    Actualmente no existen actividades
                    registradas en el cronograma de este
                    trabajo social.
                  </span>
                </div>
              </div>
            ) : (

              <div className="proceso-actividades-lista">
                {actividades.map((actividad) => {
                  const plazo =
                    obtenerPlazo(
                      actividad.estado_plazo
                    );

                  const evidencia =
                    obtenerEvidencia(
                      actividad.estado_evidencia
                    );

                  const nombreActividad =
                    actividad.actividad ||
                    'SIN DESCRIPCIÓN';

                  return (
                    <div
                      key={actividad.id}
                      className="proceso-actividad-card"
                    >

                      <div className="proceso-actividad-header">
                        <div className="proceso-actividad-titulo">
                          <span>
                            Actividad
                          </span>

                          <strong
                            title={nombreActividad}
                          >
                            {limitarPalabras(
                              nombreActividad,
                              5
                            )}
                          </strong>
                        </div>

                        <div className="proceso-actividad-badges">
                          <span
                            className={`proceso-badge plazo ${plazo.clase}`}
                          >
                            {plazo.label}
                          </span>

                          <span
                            className={`proceso-badge evidencia ${evidencia.clase}`}
                          >
                            {evidencia.label}
                          </span>
                        </div>
                      </div>

                      <div className="proceso-actividad-fechas">
                        <div>
                          <span>
                            Inicio
                          </span>

                          <strong>
                            {formatearFecha(
                              actividad.fecha
                            )}
                          </strong>
                        </div>

                        <div>
                        <span>
                            Fecha de envío
                        </span>

                        <strong>
                            {formatearFecha(
                            actividad.fecha_fin
                            )}
                        </strong>
                        </div>

                        <div>
                          <span>
                            Fecha límite
                          </span>

                          <strong>
                            {formatearFechaHora(
                              actividad.fecha_limite_actual
                            )}
                          </strong>
                        </div>
                      </div>
                      <div className="proceso-actividad-evidencia">
                        <span className="proceso-evidencia-label">
                          Evidencia
                        </span>

                        <div className="proceso-evidencia-linea" />

                        <strong className="proceso-evidencia-valor">
                          {actividad.evidencia
                            ? 'Evidencia enviada'
                            : 'No se ha enviado evidencia'}
                        </strong>
                      </div>

                      {actividad.observacion && (
                        <div className="proceso-actividad-observacion">
                          <span>
                            Observación
                          </span>

                          <p>
                            {actividad.observacion}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <div className="programas-modal-actions proceso-modal-actions">
          <button
            type="button"
            className="grupo-alumno-btn grupo-alumno-btn-cancel"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProcesoTrabajoSocialModal;