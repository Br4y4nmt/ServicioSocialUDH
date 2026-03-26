import React, { useState, useEffect } from 'react';
import Header from '../layout/Header/Header';
import SidebarDocente from 'components/layout/Sidebar/SidebarDocente';
import axios from 'axios';
import { alertError, alertSuccess } from '../../hooks/alerts/alertas';
import { showTopWarningToast } from '../../hooks/alerts/useWelcomeToast';
import '../alumno/perfil.css';
import PerfilIcon from '../alumno/PerfilIcon';
import Spinner from '../ui/Spinner';
import { useUser } from '../../UserContext';
import ExecutionIcon from '../../hooks/componentes/Icons/ExecutionIcon';

function MiPerfilDocente() {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
  const [seccionActiva, setSeccionActiva] = useState('perfil');
  const [nombre, setNombre] = useState('');
  const { user } = useUser();  
  const token = user?.token; 

  const [perfil, setPerfil] = useState({
    nombre_docente: '',
    dni: '',
    email: '',
    celular: '',
    firma_digital: '',
    facultad_id: '',
    programa_academico_id: '',
    facultad_nombre: '',
    programa_nombre: '',
  });
  
  const [celularOriginal, setCelularOriginal] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNombre(localStorage.getItem('nombre_usuario') || 'NOMBRE DEL DOCENTE');

    const usuario_id = localStorage.getItem('id_usuario');
    if (!usuario_id) return;

    const fetchPerfil = async () => {
      try {
        const res = await axios.get(
          `/api/docentes/datos/usuario/${usuario_id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const data = res.data;

        setPerfil({
          nombre_docente: data.nombre_docente || '',
          dni: data.dni || '',
          email: data.email || '',
          celular: data.celular || '',
          firma_digital: data.firma_digital || '',
          facultad_id: data.facultad_id || '',
          programa_academico_id: data.programa_academico_id || '',
          facultad_nombre: data.Facultade?.nombre_facultad || '',
          programa_nombre: data.ProgramaDelDocente?.nombre_programa || ''
        });

        setCelularOriginal(data.celular || ''); 
      } catch (error) {
        console.error('Error al obtener perfil docente:', error);
      }
    };

    fetchPerfil();
  }, [token]);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const handleGuardar = async () => {
    if (!/^\d{9}$/.test(perfil.celular)) {
      showTopWarningToast('Celular inválido', 'Debe contener exactamente 9 dígitos numéricos.');
      return;
    }
    if (perfil.celular === celularOriginal) {
      showTopWarningToast('Sin cambios', 'No se realizaron cambios.');
      return;
    }


  try {
    setLoading(true);
    const usuario_id = localStorage.getItem('id_usuario');

    await axios.put(
      `/api/docentes/actualizar-celular/${usuario_id}`,
      { celular: perfil.celular },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

  setCelularOriginal(perfil.celular);
  await alertSuccess('Número actualizado', 'Tu número celular ha sido actualizado correctamente.');

  } catch (error) {
    console.error('Error al actualizar celular:', error);
    await alertError('Error al actualizar celular', 'No se pudo actualizar el número celular. Inténtalo más tarde.');
  }
  finally {
    setLoading(false);
  }
};

const firmaUrl = perfil.firma_digital
  ? `${axios.defaults.baseURL}/uploads/firmas/${perfil.firma_digital}`
  : null;
  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <SidebarDocente
        collapsed={collapsed}
        nombre={nombre}
        onToggleSidebar={toggleSidebar}
        activeSection={'mi-perfil'}
        setActiveSection={() => {}}
      />
      {!collapsed && window.innerWidth <= 768 && (
  <div className="sidebar-overlay" onClick={toggleSidebar} />
)}
      <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        
          <h1 className="dashboard-title-animada">Mi Perfil</h1>
          <div className="card-section perfil-card">
            <aside className="perfil-left">
              <button
                className={`perfil-nav ${seccionActiva === 'perfil' ? 'active' : ''}`}
                onClick={() => setSeccionActiva('perfil')}
                type="button"
              >
                <PerfilIcon className="perfil-icon" />
                <span>Perfil</span>
              </button>

            <button
              className={`perfil-nav ${seccionActiva === 'firma' ? 'active' : ''}`}
              onClick={() => setSeccionActiva('firma')}
              type="button"
            >
              <ExecutionIcon size={18} color="currentColor" />
              <span>Firma Escaneada</span>
            </button>
            </aside>

            <div className="perfil-right">
              {seccionActiva === 'perfil' && (
                <>
                  <div className="form-group">
                    <label className="bold-text">Nombre Completo</label>
                    <input className="input-disabled" value={perfil.nombre_docente} disabled />
                  </div>

                  <div className="form-group">
                    <label className="bold-text">DNI</label>
                    <input className="input-disabled" value={perfil.dni} disabled />
                  </div>

                  <div className="form-group">
                    <label className="bold-text">Correo Institucional</label>
                    <input className="input-disabled" value={perfil.email.toLowerCase()} disabled />
                  </div>

                  <div className="form-group">
                    <label className="bold-text">
                      Número Celular <span className="campo-obligatorio">*</span>
                    </label>
                    <input
                      className="input-editable"
                      value={perfil.celular}
                      maxLength={9}
                      onChange={(e) => {
                        const soloNumeros = e.target.value.replace(/\D/g, '');
                        if (soloNumeros.length <= 9) {
                          setPerfil((prev) => ({ ...prev, celular: soloNumeros }));
                        }
                      }}
                    />
                    <p className="campo-ayuda">Puedes modificar este campo</p>
                  </div>

                  <div className="form-group">
                    <label className="bold-text">Facultad</label>
                    <input
                      className="input-disabled"
                      value={perfil.facultad_nombre || ''}
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label className="bold-text">Programa Académico</label>
                    <input
                      className="input-disabled"
                      value={perfil.programa_nombre || ''}
                      disabled
                    />
                  </div>

                  <div className="alerta-boton-wrapper">
                    <div className="alerta-importante bounce">
                      <strong>¡Importante!</strong> Mantén tu número celular actualizado para recibir notificaciones.
                    </div>

                    <div className="boton-centrado">
                      <button
                        className="btn-guardar-cambios"
                        onClick={handleGuardar}
                        type="button"
                        disabled={loading}
                      >
                        {loading ? <Spinner size={18} text="Guardando..." /> : 'Guardar Cambios'}
                      </button>
                    </div>
                  </div>
                </>
              )}

            {seccionActiva === 'firma' && (
              <div className="firma-escaneada-contenedor">

                <div style={{ marginTop: '24px', maxWidth: '350px', marginLeft: '170px' }}>
                  <label className="bold-text" style={{ marginLeft: '120px', display: 'inline-block' }}>Firma actual</label>

                  <div
                    style={{
                      marginTop: '12px',
                      border: '1px dashed #cbd5e1',
                      borderRadius: '10px',
                      minHeight: '220px',
                      maxWidth: '420px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f8fafc',
                      overflow: 'hidden',
                      padding: '12px'
                    }}
                  >
                    {firmaUrl ? (
                      <img
                        src={firmaUrl}
                        alt="Firma del docente"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100px',
                          objectFit: 'contain'
                        }}
                      />
                    ) : (
                      <span style={{ color: '#64748b' }}>Aún no guardó ninguna firma</span>
                    )}
                  </div>
                </div>
              
                <div className="firma-alerta-derecha" style={{ marginLeft: '-220px', marginTop: '20px' }}>
                  <div className="alerta-importante bounce">
                    <strong>¡Importante!</strong> Su firma se utilizará para validar documentos en el sistema.
                  </div>
                </div>  
              </div>
              
            )}
            </div>
          </div>
        
      </main>
    </>
  );
}

export default MiPerfilDocente;
