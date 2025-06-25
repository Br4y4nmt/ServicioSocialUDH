import React, { useState, useEffect } from 'react';
import Header from './Header';
import styles from './DashboardDocente.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RevisionDocente() {
  const [collapsed, setCollapsed] = useState(false);
  const [trabajosSociales, setTrabajosSociales] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Control del modal
  const [selectedTrabajo, setSelectedTrabajo] = useState(null); // Trabajo seleccionado para edición
  const [nuevoEstado, setNuevoEstado] = useState(''); // Estado editable
   const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  useEffect(() => {
    const usuarioId = localStorage.getItem('id_usuario');

    axios.get(`http://localhost:5000/api/docentes/usuario/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
      .then(response => {
        const docenteId = response.data.id_docente;

         axios.get(`http://localhost:5000/api/trabajo-social/docente/${docenteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
          .then(res => {
            setTrabajosSociales(res.data); // Guarda los trabajos sociales
          })
      })
      .catch(error => {
        console.error('Error al obtener datos del docente o sus trabajos:', error);
      });
  }, []);

  const handleEdit = (trabajo) => {
    setSelectedTrabajo(trabajo); // Establece el trabajo seleccionado
    setNuevoEstado(trabajo.estado_plan_labor_social); // Prellena el campo del estado
    setModalVisible(true); // Muestra el modal
  };
  const handleSave = () => {
    if (selectedTrabajo) {
      // Aquí hacemos la petición PUT para actualizar el estado del trabajo social
      axios.put(
      `http://localhost:5000/api/trabajo-social/${selectedTrabajo.id}`,
      {
        ...selectedTrabajo,
        estado_plan_labor_social: nuevoEstado,
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
      .then(() => {
        // Actualiza el estado de la tabla con el nuevo valor de 'estado_plan_labor_social'
        setTrabajosSociales(prev =>
          prev.map(trabajo =>
            trabajo.id === selectedTrabajo.id ? { ...trabajo, estado_plan_labor_social: nuevoEstado } : trabajo
          )
        );
        setModalVisible(false); // Cierra el modal después de guardar
      })
      .catch(error => {
        console.error('Error al actualizar el estado:', error);
      });
    }
  };
  

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-container">
          <h1 className="dashboard-title">Revisión del Docente</h1>

          <div className="card-section">
            {trabajosSociales.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Usuario ID</th>
                    <th>Programa Académico</th>
                    <th>Labor Social Nombre</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {trabajosSociales.map((trabajo) => (
                    <tr key={trabajo.id}>
                      <td>{trabajo.usuario_id}</td>

                      <td>{trabajo.ProgramasAcademico ? trabajo.ProgramasAcademico.nombre_programa : 'No disponible'}</td>
                      <td>{trabajo.LaboresSociale ? trabajo.LaboresSociale.nombre_labores : 'No disponible'}</td>
                      <td>{trabajo.estado_plan_labor_social}</td>
                      <td>
                        <button onClick={() => handleEdit(trabajo)}>
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay trabajos sociales disponibles aún.</p>
            )}
          </div>

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button onClick={() => navigate('/revision-documento-docente')}>
              Siguiente
            </button>
          </div>
        </div>
      </main>

      {modalVisible && (
  <div className={styles.modal}>
    <div className={styles.modalContent}>
      <h3>Editar Estado</h3>
      <label htmlFor="estado">Estado:</label>
      <select
        id="estado"
        value={nuevoEstado}
        onChange={(e) => setNuevoEstado(e.target.value)}
      >
        <option value="pendiente">Pendiente</option>
        <option value="aceptado">Aceptado</option>
        <option value="rechazado">Rechazado</option>
      </select>
      <div className={styles.modalActions}>
        <button onClick={handleSave}>Guardar</button>
        <button onClick={handleCloseModal}>Cerrar</button>
      </div>
    </div>
  </div>
)}


    </>
  );
}

export default RevisionDocente;
