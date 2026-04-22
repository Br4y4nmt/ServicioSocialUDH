import React, { useState, useEffect } from 'react';
import Header from '../layout/Header/Header';
import SidebarDocente from 'components/layout/Sidebar/SidebarDocente';
import axios from 'axios';
import { alertError, alertSuccess } from '../../hooks/alerts/alertas';
import { showTopWarningToast } from '../../hooks/alerts/useWelcomeToast';
import '../alumno/perfil.css';
import PerfilIcon from '../../hooks/componentes/Icons/PerfilIcon';
import Spinner from '../ui/Spinner';
import { useUser } from '../../UserContext';
import ExecutionIcon from '../../hooks/componentes/Icons/ExecutionIcon';
import UploadIcon from '../../hooks/componentes/Icons/UploadIcon';
import { cleanSignature } from '../../utils/signatureCleanup';

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
  const [firmaFile, setFirmaFile] = useState(null);
  const [firmaPreview, setFirmaPreview] = useState(null);
  const [uploadingFirma, setUploadingFirma] = useState(false);
  const [processingSignature, setProcessingSignature] = useState(false);

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
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    if (status === 409) {
      await alertError('Número duplicado', serverMessage || 'Ya existe un docente con este número de celular.');
    } else if (status === 400) {
      showTopWarningToast('Celular inválido', serverMessage || 'Celular inválido. Debe tener exactamente 9 dígitos.');
    } else if (status === 404) {
      await alertError('No encontrado', serverMessage || 'No se encontró el docente.');
    } else {
      await alertError('Error al actualizar celular', serverMessage || 'No se pudo actualizar el número celular. Inténtalo más tarde.');
    }
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

                <div className="firma-columns" style={{ marginTop: '24px', maxWidth: '760px', display: 'flex', gap: '24px' }}>
                  <div style={{ flex: '1 1 50%', maxWidth: '420px' }}>
                    <label className="bold-text" style={{ display: 'block', marginBottom: '18px', marginLeft: '130px' }}>Firma actual</label>

                    <div className="firma-container">
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

                  <div style={{ flex: '0 0 340px' }}>
                    <label className="bold-text" style={{ display: 'block', marginBottom: '8px', marginLeft: '90px' }}>Actualiza tu firma</label>
                    <div className="firma-upload-box" style={{ margin: '0 auto', marginTop: '20px', position: 'relative' }}>

                      {firmaPreview ? (
                        <img
                          src={firmaPreview}
                          alt="firma"
                          className="firma-preview-img"
                        />
                      ) : (
                        <>
                          <UploadIcon size={16} color="#555" />
                          <p>
                            Haz clic para subir tu firma
                            <span>PNG (MAX 2MB)</span>
                          </p>
                        </>
                      )}

                      {processingSignature && (
                        <div className="firma-busy-overlay">
                          <div className="spinner-lg"></div>
                          <span className="busy-text">Procesando firma...</span>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        className="firma-input"
                        disabled={processingSignature}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const preview = URL.createObjectURL(file);
                          setFirmaPreview(preview);

                          setProcessingSignature(true);

                          try {
                            const { file: cleanFile, previewUrl } = await cleanSignature(file);
                            setFirmaFile(cleanFile);
                            setFirmaPreview(previewUrl);
                          } catch (err) {
                            // fallback: keep original file
                            setFirmaFile(file);
                          }

                          setProcessingSignature(false);
                        }}
                      />

                    </div>

                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <button
                        className="btn-guardar-cambios"
                        type="button"
                        style={{ padding: '8px 14px', fontSize: '14px', minWidth: '100px', marginLeft: '120px' }}
                        onClick={async () => {
                          if (!firmaFile) return showTopWarningToast('Selecciona un archivo', 'Selecciona una imagen de firma para subir.');
                          setUploadingFirma(true);
                          try {
                              const form = new FormData();
                              form.append('celular', perfil.celular || '');
                              form.append('firma_digital', firmaFile);
                              const usuario_id = localStorage.getItem('id_usuario');

                              const res = await axios.put(
                                `/api/docentes/actualizar-celular/${usuario_id}`,
                                form,
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`
                                  }
                                }
                              );

                            const newFilename = res.data?.docente?.firma_digital || res.data?.firma_digital || res.data?.filename || res.data?.nombre_archivo || null;
                            if (newFilename) {
                              setPerfil((prev) => ({ ...prev, firma_digital: newFilename }));
                              alertSuccess('Firma subida', 'Tu firma se actualizó correctamente.');
                              setFirmaFile(null);
                            } else if (res.data?.docente && res.data.docente.firma_digital) {
                              setPerfil((prev) => ({ ...prev, firma_digital: res.data.docente.firma_digital }));
                              alertSuccess('Firma subida', 'Tu firma se actualizó correctamente.');
                              setFirmaFile(null);
                            } else {
                              alertSuccess('Subida completa', 'La firma se subió correctamente.');
                            }
                          } catch (err) {
                            console.error('Error subiendo firma', err);
                            alertError('Error', 'No se pudo subir la firma. Intenta nuevamente.');
                          } finally {
                            setUploadingFirma(false);
                            try {
                              if (firmaPreview && typeof firmaPreview === 'string' && firmaPreview.startsWith('blob:')) {
                                URL.revokeObjectURL(firmaPreview);
                              }
                            } catch (e) {
                              // ignore
                            }
                            setFirmaPreview(null);
                          }
                        }}
                        disabled={uploadingFirma || processingSignature}
                      >
                        {uploadingFirma ? 'Subiendo...' : processingSignature ? 'Procesando...' : 'Guardar'}
                      </button>

                    </div>
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
