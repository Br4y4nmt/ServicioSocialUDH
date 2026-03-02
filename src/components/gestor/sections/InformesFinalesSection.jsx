import React from 'react';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import VerBoton from "../../../hooks/componentes/VerBoton";
import { alertconfirmacion } from '../../../hooks/alerts/alertas';
import { showTopSuccessToast } from '../../../hooks/alerts/useWelcomeToast';
import FullScreenSpinner from '../../ui/FullScreenSpinner';

function InformesFinalesSection({
  informesFinales,
  busquedaDocente,
  setBusquedaDocente,
  programaSeleccionado,
  setProgramaSeleccionado,
  programas,
  aprobandoId,
  generarInforme
}) {
  return (
    <>
      {aprobandoId && <FullScreenSpinner text="Generando certificado..." />}
      <div className="docentes-container">
        <div className="docentes-card">

        <div className="docentes-header">
          <div className="docentes-header-left">
            <h2>Certificados Finales</h2>
          </div>

          <div className="docentes-header-right">
            <SearchInput
              value={busquedaDocente}
              onChange={setBusquedaDocente}
              placeholder="Nombre del estudiante"
              label="Buscar:"
              className="docentes-search-label"
            />
          </div>

          <div className="docentes-header-right">
            <label className="docentes-search-label">
              Buscar por Programa Académico:
              <select
                className="select-profesional"
                value={programaSeleccionado}
                onChange={(e) => setProgramaSeleccionado(e.target.value)}
              >
                <option value="">Todos</option>
                {programas.map((prog) => (
                  <option key={prog.id_programa} value={prog.nombre_programa}>
                    {prog.nombre_programa}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="docentes-table-wrapper">
          <table className="docentes-table">
            <thead className="docentes-table-thead">
              <tr>
                <th>Nº</th>
                <th>Estudiante</th>
                <th>Programa Academico</th>
                <th>Plan</th>
                <th>Estado - supervisor </th>
                <th>Informe final</th>
                <th>Certificado</th>
              </tr>
            </thead>

            <tbody>
              {informesFinales
                .filter((inf) =>
                  programaSeleccionado
                    ? inf.ProgramasAcademico?.nombre_programa
                        ?.toLowerCase()
                        .includes(programaSeleccionado.toLowerCase())
                    : true
                )
                .filter((inf) =>
                  buscarSinTildes(
                    inf.Estudiante?.nombre_estudiante || '',
                    busquedaDocente
                  )
                )
                .map((inf, index) => {

                  const estado = String(inf.estado_informe_final || '').toLowerCase();
                  const puedeGenerar = estado === 'aprobado';
                  const yaExisteCertificado = !!inf.certificado_final;

                  return (
                    <tr key={inf.id}>
                      <td>{index + 1}</td>

                      <td>
                        {(inf.Estudiante?.nombre_estudiante || 'SIN NOMBRE')
                          .toUpperCase()}
                      </td>

                      <td>
                        {(inf.ProgramasAcademico?.nombre_programa ||
                          'SIN PROGRAMA').toUpperCase()}
                      </td>

                      <td>
                        {inf.archivo_plan_social ? (
                          <VerBoton
                            label="Ver"
                            onClick={() =>
                              window.open(
                                `${process.env.REACT_APP_API_URL}/uploads/planes_labor_social/${inf.archivo_plan_social}`,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                          />
                        ) : (
                          <span className="no-generado">
                            NO SUBIDO
                          </span>
                        )}
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <span
                          className={`badge-estado ${
                            estado === 'aprobado'
                              ? 'aprobado'
                              : estado === 'rechazado'
                              ? 'rechazado'
                              : 'pendiente'
                          }`}
                        >
                          {estado.toUpperCase()}
                        </span>
                      </td>

                      <td>
                        {inf.informe_final_pdf ? (
                          <VerBoton
                            label="Ver"
                            onClick={() =>
                              window.open(
                                `${process.env.REACT_APP_API_URL}/uploads/informes_finales/${inf.informe_final_pdf}`,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                          />
                        ) : (
                          <span className="no-generado">
                            NO GENERADO
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {yaExisteCertificado ? (
                          <VerBoton
                            label="Ver"
                            onClick={() =>
                              window.open(
                                `${process.env.REACT_APP_API_URL}/uploads/certificados_finales/${inf.certificado_final}`,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                          />
                        ) : (
                          <button
                            className="btn-accion aceptar"
                            onClick={async () => {
                              if (!puedeGenerar || !generarInforme) return;
                              const confirm = await alertconfirmacion({
                                title: 'Generar certificado',
                                text: '¿Deseas generar el certificado final para este estudiante?',
                                confirmButtonText: 'Sí, generar',
                                cancelButtonText: 'Cancelar',
                                icon: 'question',
                                confirmButtonColor: '#2E9E7F'
                              });
                              if (confirm && confirm.isConfirmed) {
                                showTopSuccessToast('Generación iniciada', 'Se inició la generación del certificado');
                                generarInforme(inf.id);
                              }
                            }}
                            disabled={
                              !puedeGenerar ||
                              aprobandoId === inf.id
                            }
                          >
                            {aprobandoId === inf.id
                              ? 'Generando...'
                              : 'Generar'}
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}

export default React.memo(InformesFinalesSection);