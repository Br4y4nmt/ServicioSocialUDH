import React from 'react';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import VerBoton from "../../../hooks/componentes/VerBoton";

function InformesFinalesSection({
  informesFinales,
  busquedaDocente,
  setBusquedaDocente,
  programaSeleccionado,
  setProgramaSeleccionado,
  programas,
  aprobandoId,
  aceptarInforme,
  rechazarInforme
}) {
  return (
    <div className="docentes-container">
      <div className="docentes-card">
        <div className="docentes-header">
          <div className="docentes-header-left">
            <h2>Informes Finales</h2>
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
                <th>Programa</th>
                <th>Plan</th>
                <th>Fecha de Envío</th>
                <th>Informe final</th>
                <th>Documentos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {informesFinales
                .filter((inf) => {
                  return programaSeleccionado
                    ? inf.ProgramasAcademico?.nombre_programa
                        ?.toLowerCase()
                        .includes(programaSeleccionado.toLowerCase()) 
                    : true;  
                })
                .filter((inf) =>
                  buscarSinTildes(inf.Estudiante?.nombre_estudiante || '', busquedaDocente)
                )
                .map((inf, index) => (
                  <tr key={inf.id}>
                    <td>{index + 1}</td>
                    <td>{(inf.Estudiante?.nombre_estudiante || 'SIN NOMBRE').toUpperCase()}</td>
                    <td>{(inf.ProgramasAcademico?.nombre_programa || 'SIN PROGRAMA').toUpperCase()}</td>
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
                        <span className="no-generado">NO SUBIDO</span>
                      )}
                    </td>
                    <td>{new Date(inf.createdAt).toLocaleDateString()}</td>
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
                        <span className="no-generado">NO GENERADO</span>
                      )}
                    </td>
                    <td> 
                      {inf.certificado_final ? (
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
                        <span className="no-generado">NO GENERADO</span>
                      )}
                    </td>
                    <td>
                      {inf.estado_informe_final === 'pendiente' ? (
                        <>
                          <button
                            className="btn-accion aceptar"
                            onClick={() => aceptarInforme(inf.id)}
                            disabled={aprobandoId === inf.id}
                          >
                            {aprobandoId === inf.id ? (
                              <span className="btn-spinner-wrap">
                                <span className="btn-spinner" />
                                Generando...
                              </span>
                            ) : (
                              "Aprobar"
                            )}
                          </button>

                          <button
                            className="btn-accion rechazar"
                            onClick={() => rechazarInforme(inf.id)}
                            disabled={aprobandoId === inf.id}
                          >
                            Rechazar
                          </button>
                        </>
                      ) : (
                        <span
                          className={`badge-estado ${
                            inf.estado_informe_final === 'aprobado' ? 'aprobado' : 'rechazado'
                          }`}
                        >
                          {inf.estado_informe_final.toUpperCase()}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default React.memo(InformesFinalesSection);
