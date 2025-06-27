import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import SidebarProgramaAcademico from './SidebarProgramaAcademico';
import './DashboardGestor.css';
import InformePDF from '../components/InformefinalProgramaPDF'; 
import { pdf } from '@react-pdf/renderer';
import Swal from 'sweetalert2';
import { useUser } from '../UserContext';
function DashboardProgramaAcademico() {
  const [docentes, setDocentes] = useState([]);
  const [busquedaDocente, setBusquedaDocente] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('docentes');
  const [modalEditarDocenteVisible, setModalEditarDocenteVisible] = useState(false);
  const [editandoDocenteId, setEditandoDocenteId] = useState(null);
  const [informesFinales, setInformesFinales] = useState([]);
  const [nombreDocenteEditado, setNombreDocenteEditado] = useState('');  
  const [modalDocenteVisible, setModalDocenteVisible] = useState(false);
  const [nuevoDocenteEmail, setNuevoDocenteEmail] = useState('');
  const [nuevoDocenteDni, setNuevoDocenteDni] = useState('');
  const [nuevoDocenteWhatsapp, setNuevoDocenteWhatsapp] = useState('');
  const { user } = useUser();
  const token = user?.token;
  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };
  const activarEdicionDocente = (docente) => {
    setEditandoDocenteId(docente.id_docente);
    setNombreDocenteEditado(docente.nombre_docente);
    setModalEditarDocenteVisible(true);
  };
const eliminarDocente = (id_docente) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/docentes/${id_docente}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchDocentes(); 
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El docente ha sido eliminado correctamente.',
        });
      } catch (error) {
        console.error('Error al eliminar docente:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el docente.',
        });
      }
    }
  });
};

    const fetchDocentes = async () => {
    try {
      const id_usuario = localStorage.getItem('id_usuario');
      const res = await axios.get(`http://localhost:5000/api/docentes/por-programa/${id_usuario}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocentes(res.data);
    } catch (error) {
      console.error('Error al cargar docentes filtrados:', error);
    }
  };
  
   const guardarEdicionDocente = async () => {
    try {
      await axios.put(`http://localhost:5000/api/docentes/${editandoDocenteId}`, {
        nombre_docente: nombreDocenteEditado
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModalEditarDocenteVisible(false);
      setEditandoDocenteId(null);
      setNombreDocenteEditado('');
      fetchDocentes();
    } catch (error) {
      console.error('Error al actualizar docente:', error);
    }
  };
  
  const crearDocente = async () => {
    if (!nuevoDocenteEmail || !nuevoDocenteDni || !nuevoDocenteWhatsapp) {
  Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Por favor completa todos los campos del docente',
  });
  return;
}

    try {
      await axios.post('http://localhost:5000/api/auth/register-docente-nuevo', {
        email: nuevoDocenteEmail,
        dni: nuevoDocenteDni,
        whatsapp: nuevoDocenteWhatsapp,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNuevoDocenteEmail('');
      setNuevoDocenteDni('');
      setNuevoDocenteWhatsapp('');
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'El docente fue registrado correctamente.',
      });

      fetchDocentes();
    } catch (error) {
      console.error('Error al registrar docente:', error);
      Swal.fire({
      icon: 'error',
      title: 'Error al registrar',
      text: error.response?.data?.message || 'Error al registrar docente. Intenta nuevamente.',
    });
    }
  };

 useEffect(() => {
  fetchDocentes();
  fetchInformesFinales();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  
const fetchInformesFinales = async () => {
    try {
      const programaId = localStorage.getItem('programa_academico_id');
      const res = await axios.get(`http://localhost:5000/api/trabajo-social/informes-finales/programa/${programaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInformesFinales(res.data);
    } catch (error) {
      console.error('Error al cargar informes finales:', error);
    }
  };


const aceptarInforme = async (id) => {
  try {
    const informe = informesFinales.find((i) => i.id === id);
    if (!informe) return;

    const blob = await pdf(<InformePDF informe={informe} />).toBlob();

    const formData = new FormData();
    formData.append('archivo', blob, `certificado_final_${id}.pdf`);
    formData.append('trabajo_id', id);

    await axios.post('http://localhost:5000/api/trabajo-social/guardar-certificado-final', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
    });

    await axios.patch(`http://localhost:5000/api/trabajo-social/estado/${id}`, {
      nuevo_estado: 'aprobado',
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchInformesFinales();

    Swal.fire({
      icon: 'success',
      title: 'Informe aprobado',
      text: 'El PDF fue generado y guardado exitosamente.',
      confirmButtonText: 'Aceptar',
    });

  } catch (error) {
    console.error('Error al aceptar informe:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo procesar el informe.',
    });
  }
};

const rechazarInforme = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/trabajo-social/estado/${id}`, {
        nuevo_estado: 'rechazado',
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInformesFinales();
    } catch (error) {
      console.error('Error al rechazar informe:', error);
    }
  };

  return (
    <div className="layout-gestor">
      <Header onToggleSidebar={toggleSidebar} />
      <SidebarProgramaAcademico
        collapsed={collapsed}
        onToggleSidebar={toggleSidebar}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="dashboard-container-gestor">
        <h2>Panel Programa Académico</h2>
  {activeSection === 'docentes' && (
        <div className="docentes-container">
          <div className="docentes-card">
            <div className="docentes-header">
              <div className="docentes-header-left">
                <h2>Docentes</h2>
                <button className="docentes-btn-agregar" onClick={() => setModalDocenteVisible(true)}>
                  Agregar
                </button>
              </div>
              <div className="docentes-header-right">
                <label className="docentes-search-label">
                  Buscar:
                  <input
                    type="text"
                    className="docentes-search-input"
                    placeholder="Nombre del docente"
                    value={busquedaDocente}
                    onChange={(e) => setBusquedaDocente(e.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="docentes-table-wrapper">
              <table className="docentes-table">
                <thead className="docentes-table-thead">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Facultad</th>
                    <th>Programa Académico</th>
                    <th>Acciones</th>

                  </tr>
                </thead>
                <tbody>
                  {docentes
                    .filter((doc) =>
                        doc.nombre_docente && doc.nombre_docente.toLowerCase().includes(busquedaDocente.toLowerCase())
                      )
                    .map((doc) => (
                      <tr key={doc.id_docente}>
                        <td>{doc.id_docente}</td>
                        <td>{doc.nombre_docente.toUpperCase()}</td>
                        <td>{doc.Facultade?.nombre_facultad?.toUpperCase() || 'SIN FACULTAD'}</td>
                        <td>{doc.ProgramasAcademico?.nombre_programa?.toUpperCase() || 'SIN PROGRAMA'}</td>
                        <td>
                        <button
                            className="docentes-btn editar"
                            onClick={() => activarEdicionDocente(doc)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
                            </svg>
                        </button>

                        <button
                            className="docentes-btn eliminar"
                            onClick={() => eliminarDocente(doc.id_docente)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16">
                            <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
                            </svg>
                        </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    )}

 {activeSection === 'informes-finales' && (
  <div className="docentes-container">
    <div className="docentes-card">
      <div className="docentes-header">
        <div className="docentes-header-left">
          <h2>Informes Finales</h2>
        </div>
        <div className="docentes-header-right">
          <label className="docentes-search-label">
            Buscar:
            <input
              type="text"
              className="docentes-search-input"
              placeholder="Nombre del estudiante"
              value={busquedaDocente}
              onChange={(e) => setBusquedaDocente(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="docentes-table-wrapper">
        <table className="docentes-table">
          <thead className="docentes-table-thead">
            <tr>
              <th>ID</th>
              <th>Estudiante</th>
              <th>Programa</th>
              <th>Facultad</th>
              <th>Fecha de Envío</th>
              <th>Archivo</th>
              <th>Documentos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
           {informesFinales
  .filter((inf) =>
    inf.Estudiante?.nombre_estudiante?.toLowerCase().includes(busquedaDocente.toLowerCase())
  )
  .map((inf) => (
    <tr key={inf.id}>
      <td>{inf.id}</td>
      <td>{inf.Estudiante?.nombre_estudiante?.toUpperCase() || 'SIN NOMBRE'}</td>
      <td>{inf.ProgramasAcademico?.nombre_programa?.toUpperCase() || 'SIN PROGRAMA'}</td>
      <td>{inf.Facultad?.nombre_facultad?.toUpperCase() || 'SIN FACULTAD'}</td>
      <td>{new Date(inf.createdAt).toLocaleDateString()}</td>
      
      <td>
  {inf.informe_final_pdf ? (
    <a
  href={`http://localhost:5000/uploads/informes_finales/${inf.informe_final_pdf}`}
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
<td>
  {inf.certificado_final ? (
    <a
      href={`http://localhost:5000/uploads/certificados_finales/${inf.certificado_final}`}
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

  <td>
  {inf.estado_informe_final === 'pendiente' ? (
    <>
      <button
        className="btn-accion aceptar"
        onClick={() => aceptarInforme(inf.id)}
      >
        Aprobar
      </button>
      <button
        className="btn-accion rechazar"
        onClick={() => rechazarInforme(inf.id)}
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
)}

        {modalDocenteVisible && (
          <div className="docentes-modal show">
            <div className="docentes-modal-content">
              <h3>Registrar Docente</h3>
              <input
                type="email"
                className="docentes-modal-input"
                placeholder="Email del docente"
                value={nuevoDocenteEmail}
                onChange={(e) => setNuevoDocenteEmail(e.target.value)}
              />
                <input
                  type="text"
                  className="docentes-modal-input"
                  placeholder="DNI del docente"
                  value={nuevoDocenteDni}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Solo permitir números y limitar a 8 caracteres
                    if (value.length <= 8 && /^\d*$/.test(value)) {
                      setNuevoDocenteDni(value);
                    }
                  }}
                />
              <input
                type="text"
                className="docentes-modal-input"
                placeholder="WhatsApp del docente"
                value={nuevoDocenteWhatsapp}
                onChange={(e) => setNuevoDocenteWhatsapp(e.target.value)}
              />
              <div className="docentes-modal-actions">
                <button
                  className="docentes-btn cancelar"
                  onClick={() => {
                    setModalDocenteVisible(false);
                    setNuevoDocenteEmail('');
                    setNuevoDocenteDni('');
                    setNuevoDocenteWhatsapp('');
                  }}
                >
                  Cancelar
                </button>
                 <button
                  className="docentes-btn guardar"
                  onClick={() => {
                    // Validación de DNI
                    if (nuevoDocenteDni.length < 8) {
                      Swal.fire({
                        icon: 'error',
                        title: '¡Error!',
                        text: 'El DNI debe tener al menos 8 dígitos.',
                      });
                      return;
                    }

                    // Si el DNI es válido, proceder con la creación del docente
                    crearDocente();
                    setModalDocenteVisible(false);
                  }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}



{modalEditarDocenteVisible && (
  <div className="docentes-modal show">
    <div className="docentes-modal-content">
      <h3>Editar Docente</h3>
      <input
        type="text"
        className="docentes-modal-input"
        placeholder="Nuevo nombre del docente"
        value={nombreDocenteEditado}
        onChange={(e) => setNombreDocenteEditado(e.target.value)}
        autoFocus
      />
      <div className="docentes-modal-actions">
        <button
          className="docentes-btn cancelar"
          onClick={() => {
            setModalEditarDocenteVisible(false);
            setEditandoDocenteId(null);
            setNombreDocenteEditado('');
          }}
        >
          Cancelar
        </button>
        <button
          className="docentes-btn guardar"
          onClick={guardarEdicionDocente}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}

export default DashboardProgramaAcademico;
