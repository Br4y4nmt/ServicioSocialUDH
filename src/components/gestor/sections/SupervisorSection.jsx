import React from 'react';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import DeleteIcon from "../../../hooks/componentes/Icons/DeleteIcon";

function SupervisorSection({
  supervisores,
  busquedaSupervisor,
  setBusquedaSupervisor,
  programaSupervisor,
  setProgramaSupervisor,
  programas,
  eliminarSupervisor
}) {
  return (
    <div className="docentes-container">
      <div className="docentes-card">
        <div className="docentes-header">
          <div className="docentes-header-left">
            <h2>Desig. Docente Supervisor</h2>
          </div>

          <div className="docentes-header-right">
            <SearchInput
              value={busquedaSupervisor}
              onChange={setBusquedaSupervisor}
              placeholder="Nombre del estudiante"
              label="Buscar:"
              className="docentes-search-label"
            />
          </div>

          <label className="docentes-search-label">
            Buscar por Programa Académico:
            <select
              className="select-profesional"
              value={programaSupervisor}
              onChange={(e) => setProgramaSupervisor(e.target.value)}
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

        <div className="docentes-table-wrapper">
          <table className="docentes-table">
            <thead className="docentes-table-thead">
              <tr>
                <th>Nº</th>
                <th>Nombre</th>
                <th>Programa Académico</th>
                <th>Estado</th>
                <th>Carta de Aceptación</th>
                <th>Supervisor</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {(supervisores || [])
                .filter((sup) =>
                  buscarSinTildes(sup.estudiante?.nombre_estudiante || '', busquedaSupervisor || '')
                )
                .filter((sup) => {
                  if (!programaSupervisor) return true;
                  const nombreProg =
                    sup.programa?.nombre_programa ||
                    sup.ProgramasAcademico?.nombre_programa ||
                    '';
                  return (
                    nombreProg.toLowerCase() === programaSupervisor.toLowerCase()
                  );
                })
                .map((sup, index) => {
                  const nombre = (sup.estudiante?.nombre_estudiante || 'SIN NOMBRE').toUpperCase();
                  const programa =
                    (sup.programa?.nombre_programa ||
                      sup.ProgramasAcademico?.nombre_programa ||
                      'SIN PROGRAMA').toUpperCase();
                  const supervisor =
                    sup.supervisor?.nombre_supervisor ||
                    sup.supervisor?.nombre ||
                    'SIN SUPERVISOR';
                  const cartaPdf = sup.carta_aceptacion_pdf || sup.carta_pdf || null;

                  return (
                    <tr key={sup.id_supervisor || sup.id || index}>
                      <td>{index + 1}</td>
                      <td>{nombre}</td>
                      <td>{programa}</td>
                      <td>
                        {(() => {
                          const raw = (
                            sup.estado ||
                            sup.estado_plan_labor_social ||
                            'pendiente'
                          ).toLowerCase();
                          const estado = ['aceptado', 'rechazado', 'pendiente'].includes(raw)
                            ? raw
                            : 'pendiente';
                          const label = {
                            aceptado: 'Aceptado',
                            rechazado: 'Rechazado',
                            pendiente: 'Pendiente',
                          }[estado];

                          return <span className={`badge-estado ${estado}`}>{label}</span>;
                        })()}
                      </td>
                      <td>
                        {cartaPdf ? (
                          <a
                            href={`${process.env.REACT_APP_API_URL}/uploads/planes_labor_social/${cartaPdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-ver-pdf"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="#2e2e2e"
                              viewBox="0 0 24 24"
                              className="icono-ojo"
                            >
                              <path d="M12 4.5C7 4.5 2.73 8.11 1 12c1.73 3.89 6 7.5 11 7.5s9.27-3.61 11-7.5c-1.73-3.89-6-7.5-11-7.5zm0 13c-3.03 0-5.5-2.47-5.5-5.5S8.97 6.5 12 6.5s5.5 2.47 5.5 5.5S15.03 17.5 12 17.5zm0-9c-1.93 0-3.5 1.57-3.5 3.5S10.07 15.5 12 15.5s3.5-1.57 3.5-3.5S13.93 8.5 12 8.5z" />
                            </svg>
                            <span>Ver</span>
                          </a>
                        ) : (
                          <span className="no-generado">NO GENERADO</span>
                        )}
                      </td>
                      <td>{supervisor}</td>
                      <td>
                        <button
                          onClick={() => eliminarSupervisor(sup.id || sup.id_supervisor)}
                          className="facultades-btn eliminar"
                          title="Eliminar designación"
                        >
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default React.memo(SupervisorSection);