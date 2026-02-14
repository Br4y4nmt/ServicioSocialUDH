import React from 'react';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';

function EstudiantesSection({
  estudiantes,
  filtroEstudiantes,
  setFiltroEstudiantes,
  programaSeleccionado,
  setProgramaSeleccionado,
  programas,
  setModalEstudianteVisible
}) {
  return (
    <div className="docentes-container">
      <div className="docentes-card">
        <div className="docentes-header">
          <div className="docentes-header-left flex items-center gap-4">
            <h2>Estudiantes</h2>
            <button
              className="docentes-btn-agregar"
              onClick={() => setModalEstudianteVisible(true)}
            >
              Agregar
            </button>
          </div>
          <div className="docentes-header-right">
            <SearchInput
              value={filtroEstudiantes}
              onChange={setFiltroEstudiantes}
              placeholder="Nombre del estudiante o DNI"
              label="Buscar:"
              className="docentes-search-label"
            />
          </div>

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

        <div className="docentes-table-wrapper">
          <table className="docentes-table">
            <thead className="docentes-table-thead">
              <tr>
                <th>Nº</th> 
                <th>Nombre</th>
                <th>DNI</th>
                <th>Correo</th>
                <th>Celular</th>
                <th>Programa Académico</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes
                .filter((est) => {
                  const coincideTexto =
                    buscarSinTildes(est.nombre_estudiante || '', filtroEstudiantes) ||
                    est.dni?.includes(filtroEstudiantes);

                  const coincidePrograma =
                    programaSeleccionado === '' ||
                    est.programa?.nombre_programa === programaSeleccionado;

                  return coincideTexto && coincidePrograma;
                })
                .map((est, index) => (
                  <tr key={est.id_estudiante}>
                    <td>{index + 1}</td>
                    <td>{est.nombre_estudiante || 'SIN NOMBRE'}</td>
                    <td>{est.dni || '—'}</td>
                    <td>{est.email || 'SIN CORREO'}</td>
                    <td>{est.celular || '—'}</td>
                    <td>{est.programa?.nombre_programa?.toUpperCase() || 'SIN PROGRAMA'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default React.memo(EstudiantesSection);
