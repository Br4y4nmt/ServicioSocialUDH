import React from 'react';
import SearchInput from '../SearchInput';
import { buscarSinTildes } from '../../../utils/textUtils';
import VerBoton from "../../../hooks/componentes/VerBoton";

function SeguimientoTramiteSection({
  estudiantes,
  filtroEstudiantes,
  setFiltroEstudiantes,
  verSeguimiento
}) {
  return (
    <div className="docentes-container">
      <div className="docentes-card">
        <div className="docentes-header">
          <div className="docentes-header-left">
            <h2>Seguimiento de Trámite</h2>
          </div>

          <div className="docentes-header-right">
            <SearchInput
              value={filtroEstudiantes}
              onChange={setFiltroEstudiantes}
              placeholder="Nombre del estudiante"
              label="Buscar:"
              className="docentes-search-label"
            />
          </div>
        </div>

        <div className="docentes-table-wrapper">
          <table className="docentes-table">
            <thead className="docentes-table-thead">
              <tr>
                <th>Nº</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Programa Académico</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes
                .filter((est) =>
                  buscarSinTildes(est.nombre_estudiante || '', filtroEstudiantes)
                )
                .map((est, index) => (
                  <tr key={est.id_estudiante}>
                    <td>{index + 1}</td>
                    <td>{est.nombre_estudiante || 'SIN NOMBRE'}</td>
                    <td>{est.email || 'SIN CORREO'}</td>
                    <td>{est.programa?.nombre_programa?.toUpperCase() || 'SIN PROGRAMA'}</td>
                    <td>
                      <VerBoton
                        onClick={() => verSeguimiento(est.id_estudiante)}
                        label="Ver"
                      />
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

export default React.memo(SeguimientoTramiteSection);
