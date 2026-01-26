import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import Swal from 'sweetalert2';

function EstudiantesConcluidos({
  estudiantes,
  filtroEstudiantes,
  setFiltroEstudiantes,
  programas,
  setModalEstudianteVisible,
}) {
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const { user } = useUser();
  const token = user?.token;
  const [estudiantesLocal, setEstudiantesLocal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Toast reusable
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });

  useEffect(() => {
    const fetchFinalizados = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get('/api/trabajo-social/estudiantes-finalizados', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data || [];
        const mapped = data.map((item) => {
          const est = item.estudiante || {};
          return {
            id_estudiante: est.id_estudiante || null,
            nombre_estudiante: est.nombre_estudiante,
            dni: est.dni,
            email: est.email,
            codigo: est.codigo,
            celular: est.celular,
            sede: est.sede,
            modalidad: est.modalidad,
            estado: est.estado,
            programa: est.programa || null,
            trabajo: item.trabajo || null,
          };
        });

        setEstudiantesLocal(mapped);
      } catch (err) {
        console.error('Error fetching estudiantes-finalizados:', err);
        setError('No se pudieron cargar los estudiantes finalizados');
      } finally {
        setLoading(false);
      }
    };

    fetchFinalizados();
  }, [token]);

  const actualizarEstado = async (id_estudiante, nuevoEstado) => {
    if (!token) return;

    // Solo confirmamos cuando pasa a ATENDIDO (según tu flujo)
    if (nuevoEstado === 'ATENDIDO') {
      const confirm = await Swal.fire({
        title: '¿Confirmar cambio?',
        text: 'Se marcará como ATENDIDO.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      });

      if (!confirm.isConfirmed) {
        // Canceló: no hacemos nada (y el select se "resetea" porque el value es fijo NO_ATENDIDO)
        return;
      }
    }

    try {
      setUpdatingId(id_estudiante);

      await axios.patch(
        `/api/estudiantes/${id_estudiante}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEstudiantesLocal((prev) =>
        prev.map((e) =>
          e.id_estudiante === id_estudiante ? { ...e, estado: nuevoEstado } : e
        )
      );

      Toast.fire({
        icon: 'success',
        title: `Estado actualizado a ${nuevoEstado.replace('_', ' ')}`,
      });
    } catch (err) {
      console.error('Error actualizando estado:', err);

      Toast.fire({
        icon: 'error',
        title: 'No se pudo actualizar el estado',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="docentes-container">
      <div className="docentes-card">
        <div className="docentes-header">
          <div className="docentes-header-left flex items-center gap-4">
            <h2>Estudiantes concluidos</h2>
          </div>

          <div className="docentes-header-right">
            <label className="docentes-search-label">
              Buscar:
              <input
                type="text"
                className="docentes-search-input-es"
                placeholder="Nombre del estudiante o DNI"
                value={filtroEstudiantes}
                onChange={(e) => setFiltroEstudiantes(e.target.value)}
              />
            </label>
          </div>

          <label className="docentes-search-label">
            Filtrar por estado:
            <select
              className="select-profesional"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="atendidos">Atendidos</option>
              <option value="no atendidos">No atendidos</option>
            </select>
          </label>
        </div>

        {loading && (
          <div className="no-generado">Cargando estudiantes...</div>
        )}

        {error && (
          <div className="no-generado" style={{ color: '#a13039' }}>{error}</div>
        )}

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
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {(estudiantesLocal.length ? estudiantesLocal : estudiantes)
                .filter((est) => {
                  const coincideTexto =
                    est.nombre_estudiante?.toLowerCase().includes(filtroEstudiantes.toLowerCase()) ||
                    est.dni?.includes(filtroEstudiantes);

                  const estado = (est.estado || '').toString().trim().toLowerCase();

                  let coincideEstado = true;
                  if (estadoFiltro === 'atendidos') {
                    coincideEstado = estado === 'atendido';
                  } else if (estadoFiltro === 'no atendidos') {
                    coincideEstado = estado === 'no_atendido' || estado === 'no atendido';
                  }

                  return coincideTexto && coincideEstado;
                })
                .map((est, index) => (
                  <tr key={est.id_estudiante}>
                    <td>{index + 1}</td>
                    <td>{est.nombre_estudiante || 'SIN NOMBRE'}</td>
                    <td>{est.dni || '—'}</td>
                    <td>{est.email || 'SIN CORREO'}</td>
                    <td>{est.celular || '—'}</td>
                    <td>{est.programa?.nombre_programa?.toUpperCase() || 'SIN PROGRAMA'}</td>
                    <td>
                      {(() => {
                        const estadoLower = (est.estado || '').toString().trim().toLowerCase();
                        const disabled = updatingId === est.id_estudiante;

                        // SOLO si está NO ATENDIDO aparece el select
                        if (estadoLower === 'no_atendido' || estadoLower === 'no atendido') {
                          return (
                            <select
                              className="select-estado-estudiante"
                              value="NO_ATENDIDO"
                              disabled={disabled}
                              onChange={(e) => actualizarEstado(est.id_estudiante, e.target.value)}
                            >
                              <option value="NO_ATENDIDO">NO ATENDIDO</option>
                              <option value="ATENDIDO">ATENDIDO</option>
                            </select>
                          );
                        }

                        if (estadoLower === 'atendido') {
                          return <span className="badge-estado-estudiantes aprobado">ATENDIDO</span>;
                        }

                        return <span className="badge-estado-estudiantes">—</span>;
                      })()}
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

export default EstudiantesConcluidos;
