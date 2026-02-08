import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import Swal from 'sweetalert2';
import SearchInput from './SearchInput';
import { buscarSinTildes } from '../utils/textUtils';

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
  const [udhDown, setUdhDown] = useState(false);

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
      setError(null);

      try {
        const res = await axios.get('/api/trabajo-social/estudiantes-finalizados', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // guardar flag udhDown que manda el backend
        setUdhDown(!!res.data?.meta?.udhDown);

        const data = res.data?.data || [];

        // ✅ Creamos filas para: estudiante principal + integrantes si es grupal
        const mapped = data.flatMap((item) => {
          const est = item.estudiante || {};
          const trabajo = item.trabajo || {};

          const filaPrincipal = {
            rowType: 'estudiante',
            id_estudiante: est.id_estudiante || null,
            id_integrante: null,

            nombre_estudiante: est.nombre_estudiante,
            dni: est.dni,
            email: est.email,
            codigo: est.codigo,
            celular: est.celular,
            sede: est.sede,
            modalidad: est.modalidad,
            estado: est.estado,

            programa: est.programa || null,
            trabajo,
          };

          // Si NO es grupal, solo devolvemos la fila principal
          if ((trabajo.tipo_servicio_social || '').toString().trim().toLowerCase() !== 'grupal') {
            return [filaPrincipal];
          }

          // Si es grupal, agregamos integrantes como filas extra
          const integrantes = Array.isArray(trabajo.integrantes_grupo) ? trabajo.integrantes_grupo : [];

          const filasIntegrantes = integrantes.map((ig) => ({
            rowType: 'integrante',
            id_estudiante: null,
            id_integrante: ig?.__integrante_grupo?.id_integrante || null,

            nombre_estudiante: ig?.nombre_estudiante || null,
            dni: ig?.dni || null,
            email: ig?.email || null,
            codigo: ig?.codigo || null,
            celular: ig?.celular || null,
            sede: ig?.sede || null,
            modalidad: ig?.modalidad || null,

            // ✅ Este estado debe venir desde BD (integrantes_grupo.estado)
            estado: ig?.estado || null,

            programa: ig?.programa || null,
            trabajo,
            __integrante_grupo: ig?.__integrante_grupo || null,
          }));

          return [filaPrincipal, ...filasIntegrantes];
        });

        setEstudiantesLocal(mapped);
      } catch (err) {
        console.error('Error fetching estudiantes-finalizados:', err);
        // si el backend responde 503/502/504, marcar UDH caído
        const status = err?.response?.status;
        if (status === 503 || status === 502 || status === 504) {
          setUdhDown(true);
          setError(null);
          setLoading(false);
          return;
        }

        setError('No se pudieron cargar los estudiantes finalizados');
      } finally {
        setLoading(false);
      }
    };

    fetchFinalizados();
  }, [token]);

  // ✅ Ahora actualiza ESTUDIANTE o INTEGRANTE según lo que venga
  const actualizarEstado = async ({ id_estudiante, id_integrante }, nuevoEstado) => {
    if (!token) return;

    const estadoFinal = String(nuevoEstado || '').toUpperCase().trim();

    // Solo confirmamos cuando pasa a ATENDIDO (según tu flujo)
    if (estadoFinal === 'ATENDIDO') {
      const confirm = await Swal.fire({
        title: '¿Confirmar cambio?',
        text: 'Se marcará como ATENDIDO.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      });

      if (!confirm.isConfirmed) return;
    }

    const rowId = id_estudiante || id_integrante;

    try {
      setUpdatingId(rowId);

      // ✅ Usamos tu PATCH (opción 2) que recibe ids por body
      // Si tu backend sigue en /api/estudiantes/:id/estado, puedes dejar /0/estado
      await axios.patch(
        `/api/estudiantes/0/estado`,
        { id_estudiante, id_integrante, estado: estadoFinal },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEstudiantesLocal((prev) =>
        prev.map((e) => {
          const same =
            (id_estudiante && e.id_estudiante === id_estudiante) ||
            (id_integrante && e.id_integrante === id_integrante);

          return same ? { ...e, estado: estadoFinal } : e;
        })
      );

      Toast.fire({
        icon: 'success',
        title: `Estado actualizado a ${estadoFinal.replace('_', ' ')}`,
      });
    } catch (err) {
      console.error('Error actualizando estado:', err);
      Toast.fire({ icon: 'error', title: 'No se pudo actualizar el estado' });
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
            <SearchInput
              value={filtroEstudiantes}
              onChange={setFiltroEstudiantes}
              placeholder="Nombre del estudiante o DNI"
              label="Buscar:"
              className="docentes-search-label"
            />
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

        {loading && <div className="no-generado">Cargando estudiantes...</div>}

        {error && (
          <div className="no-generado" style={{ color: '#a13039' }}>
            {error}
          </div>
        )}

        {udhDown && (
          <div className="no-generado" style={{ color: '#a13039' }}>
            Servidor universitario en mantenimiento. Intente más tarde.
          </div>
        )}

        {!udhDown && (
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
                    buscarSinTildes(est.nombre_estudiante || '', filtroEstudiantes) ||
                    (est.dni || '').toString().includes(filtroEstudiantes);

                  const estado = (est.estado || '').toString().trim().toLowerCase();

                  let coincideEstado = true;
                  if (estadoFiltro === 'atendidos') {
                    coincideEstado = estado === 'atendido';
                  } else if (estadoFiltro === 'no atendidos') {
                    coincideEstado = estado === 'no_atendido' || estado === 'no atendido';
                  }

                  return coincideTexto && coincideEstado;
                })
                .map((est, index) => {
                  const rowKey = `${est.rowType}-${est.id_estudiante || est.id_integrante || index}`;
                  const rowId = est.id_estudiante || est.id_integrante;

                  return (
                    <tr key={rowKey}>
                      <td>{index + 1}</td>

                      <td>
                        {est.nombre_estudiante || 'SIN NOMBRE'}
                        {est.rowType === 'integrante' && (
                          <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.7 }}>
                            (Integrante)
                          </span>
                        )}
                        {est.rowType === 'estudiante' &&
                          (est.trabajo?.tipo_servicio_social || '').toLowerCase() === 'grupal' && (
                            <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.7 }}>
                              (Grupo)
                            </span>
                          )}
                      </td>

                      <td>{est.dni || '—'}</td>
                      <td>{est.email || 'SIN CORREO'}</td>
                      <td>{est.celular || '—'}</td>
                      <td>{est.programa?.nombre_programa?.toUpperCase() || 'SIN PROGRAMA'}</td>

                      <td>
                        {(() => {
                          const estadoLower = (est.estado || '').toString().trim().toLowerCase();
                          const disabled = updatingId === rowId;

                          // SOLO si está NO ATENDIDO aparece el select
                          if (estadoLower === 'no_atendido' || estadoLower === 'no atendido') {
                            return (
                              <select
                                className="select-estado-estudiante"
                                value="NO_ATENDIDO"
                                disabled={disabled}
                                onChange={(e) =>
                                  actualizarEstado(
                                    {
                                      id_estudiante: est.id_estudiante,
                                      id_integrante: est.id_integrante,
                                    },
                                    e.target.value
                                  )
                                }
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
                  );
                })}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}

export default EstudiantesConcluidos;
