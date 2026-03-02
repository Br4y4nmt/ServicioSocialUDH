import React, { useState, useEffect } from 'react';
import Header from '../layout/Header/Header';
import axios from 'axios';
import SidebarDocente from 'components/layout/Sidebar/SidebarDocente';
import '../alumno/perfil.css';
import PerfilIcon from '../alumno/PerfilIcon';
import UploadIcon from "../../hooks/componentes/Icons/UploadIcon";
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { cleanSignature } from '../../utils/signatureCleanup';
import useIsMobile from '../../hooks/useIsMobile';
import {
  alertWarning,
  alertInfo,
  toastWarning,
  alertSuccess,
  alertError,
} from '../../hooks/alerts/alertas';
import { showTopWarningToast } from '../../hooks/alerts/useWelcomeToast';
import FullScreenSpinner from '../ui/FullScreenSpinner';

function PerfilDocente() {

  const isMobile = useIsMobile(768);
  const [collapsed, setCollapsed] = useState(() => isMobile);

  const [form, setForm] = useState({
    nombre: '',
    dni: '',
    email: '',
    facultad: '',
    programaAcademico: '',
    celular: '',
  });

  const [firma, setFirma] = useState(null);
  const [firmaPreview, setFirmaPreview] = useState(null);

  const [facultadNombre, setFacultadNombre] = useState('');
  const [programaNombre, setProgramaNombre] = useState('');

  const [loading, setLoading] = useState(false);
  const [processingSignature, setProcessingSignature] = useState(false);

  const { user } = useUser();
  const token = user?.token;

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setFirmaPreview(prev => {
        if (prev && prev.startsWith('blob:')) {
          URL.revokeObjectURL(prev);
        }
        return null;
      });
    };
  }, []);

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  useEffect(() => setCollapsed(isMobile), [isMobile]);

  useEffect(() => {
    const nombreGuardado = localStorage.getItem('nombre_usuario');
    const correoGuardado = localStorage.getItem('correo_institucional');

    setForm(p => ({
      ...p,
      nombre: nombreGuardado || '',
      email: correoGuardado || ''
    }));
  }, []);

  useEffect(() => {

    if (!token) return;

    const controller = new AbortController();

    (async () => {

      try {

        const { data } = await axios.get('/api/docentes/perfil', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        });

        setForm(p => ({
          ...p,
          dni: data.dni || '',
          facultad: data.facultad_id || '',
          programaAcademico: data.programa_id || '',
          celular: data.celular || ''
        }));

        setFacultadNombre(data.facultad_nombre || '');
        setProgramaNombre(data.programa_nombre || '');

      } catch (err) {

        if (err.name === 'CanceledError') return;

        console.error(err);

        alertError(
          'Error al cargar perfil',
          err.response?.data?.message || 'Inténtalo más tarde.'
        );

      }

    })();

    return () => controller.abort();

  }, [token]);

  const handleCelularChange = (e) => {

    const value = e.target.value;

    if (/^\d{0,9}$/.test(value)) {

      setForm(p => ({
        ...p,
        celular: value
      }));

    }

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (processingSignature) {
      alertInfo('Procesando firma', 'Espera un momento.');
      return;
    }

    if (
      !form.nombre ||
      !form.dni ||
      !form.email ||
      !form.facultad ||
      !form.programaAcademico ||
      !form.celular ||
      !firma
    ) {

      showTopWarningToast('Faltan datos', 'Completa todos los campos.');
      return;

    }

    if (!/^\d{8}$/.test(form.dni)) {

      toastWarning('DNI inválido', {
        text: 'Debe tener 8 dígitos.'
      });

      return;

    }

    if (!/^\d{9}$/.test(form.celular)) {

      toastWarning('Celular inválido', {
        text: 'Debe tener 9 dígitos.'
      });

      return;

    }

    const id_usuario = localStorage.getItem('id_usuario');

    if (!id_usuario) {
      alertError('Error', 'No se encontró el usuario.');
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append('nombre_docente', form.nombre);
      formData.append('dni', form.dni);
      formData.append('email', form.email);
      formData.append('facultad', form.facultad);
      formData.append('programa_academico_id', form.programaAcademico);
      formData.append('celular', form.celular);
      formData.append('id_usuario', id_usuario);
      formData.append('firma_digital', firma);

      await axios.put('/api/docentes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      localStorage.setItem('firma_docente_completa', 'true');

      alertSuccess('Perfil actualizado', 'Se guardó correctamente')
        .then(() => navigate('/dashboard-docente'));

    } catch (error) {

      console.error(error);

      alertError(
        'Error',
        error.response?.data?.message || 'No se pudo guardar.'
      );

    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      <SidebarDocente
        collapsed={collapsed}
        nombre={localStorage.getItem('nombre_usuario')}
        onToggleSidebar={toggleSidebar}
        activeSection={'perfil-docente'}
        setActiveSection={() => {}}
      />

      {isMobile && !collapsed && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
        ></div>
      )}

      <Header onToggleSidebar={toggleSidebar} />

      {loading && <FullScreenSpinner text="Actualizando perfil..." />}

      <main className={`main-content${collapsed ? ' collapsed' : ''}`}>

        <h1 className="dashboard-title-animada">
          Datos Docente
        </h1>

        <div className="card-section perfil-card">

          <aside className="perfil-left">
            <button className="perfil-nav active">
              <PerfilIcon className="perfil-icon" />
              <span>Perfil</span>
            </button>
          </aside>

          <form onSubmit={handleSubmit}>

            <div className="perfil-right">

              <div className="form-group">
                <label className="bold-text">Nombre Completo</label>
                <input className="input-disabled" value={form.nombre} disabled />
              </div>

              <div className="form-group">
                <label className="bold-text">DNI</label>
                <input
                  className="input-disabled"
                  value={form.dni}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^\d{0,8}$/.test(v)) {
                      setForm(p => ({ ...p, dni: v }));
                    }
                  }}
                />
                <small className="text-muted">Debe tener 8 dígitos</small>
              </div>

              <div className="form-group">
                <label className="bold-text">Correo Institucional</label>
                <input className="input-disabled" value={form.email} disabled />
              </div>

              <div className="form-group">
                <label className="bold-text">Facultad</label>
                <input className="input-disabled" value={facultadNombre} disabled />
              </div>

              <div className="form-group">
                <label className="bold-text">Programa Académico</label>
                <input className="input-disabled" value={programaNombre} disabled />
              </div>

              <div className="form-group">
                <label className="bold-text">Celular</label>
                <input
                  className="input-editable"
                  value={form.celular}
                  onChange={handleCelularChange}
                  maxLength={9}
                  inputMode="numeric"
                />
                <small className="text-muted">Puedes modificar este campo</small>
              </div>

            </div>

            <div className="firma-section">

              <h3 className="firma-title">
                Sube tu firma escaneada
              </h3>

              <div className="alerta-importante bounce" style={{ margin: '0 auto', display: 'block', textAlign: 'center' }}>
                <strong>¡Importante!</strong>
                Recuerda subir tu firma para validar documentos en el sistema.
              </div>

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
                    <span className="busy-text">
                      Procesando firma...
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  className="firma-input"
                  disabled={processingSignature}
                  onChange={async (e) => {

                    const file = e.target.files[0];
                    if (!file) return;

                    const preview = URL.createObjectURL(file);
                    setFirmaPreview(preview);

                    setProcessingSignature(true);

                    try {

                      const { file: cleanFile, previewUrl }
                        = await cleanSignature(file);

                      setFirma(cleanFile);
                      setFirmaPreview(previewUrl);

                    } catch {
                      setFirma(file);
                    }

                    setProcessingSignature(false);

                  }}
                />

              </div>

            </div>

            <div className="boton-centrado" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button
                className="btn-guardar-cambios"
                disabled={loading || processingSignature}
              >
                {loading ? "Actualizando..." : "Guardar Cambios"}
              </button>
            </div>

          </form>

        </div>

      </main>
    </>
  );
}

export default PerfilDocente;