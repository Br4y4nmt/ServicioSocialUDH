import React from 'react';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import DeleteIcon from "../../../hooks/componentes/Icons/DeleteIcon";
import VerBoton from "../../../hooks/componentes/VerBoton";

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
                          let estado = raw === 'aceptado' ? 'aprobado' : raw;
                          estado = ['aprobado', 'rechazado', 'pendiente'].includes(estado)
                            ? estado
                            : 'pendiente';
                          const label = {
                            aprobado: 'Aceptado',
                            rechazado: 'Rechazado',
                            pendiente: 'Pendiente',
                          }[estado];

                          return <span className={`badge-estado ${estado}`}>{label}</span>;
                        })()}
                      </td>
                      <td>
                        {cartaPdf ? (
                          <VerBoton
                            label="Ver"
                            onClick={() =>
                              window.open(
                                `${process.env.REACT_APP_API_URL}/uploads/planes_labor_social/${cartaPdf}`,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                          />
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