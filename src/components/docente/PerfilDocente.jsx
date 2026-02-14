import React, { useState, useEffect } from 'react';
import Header from '../layout/Header/Header';
import axios from 'axios';
import SidebarDocente from 'components/layout/Sidebar/SidebarDocente';
import './PerfilDocente.css';  
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
  const { user } = useUser();
  const token = user?.token;
  const [facultadNombre, setFacultadNombre] = useState('');
  const [programaNombre, setProgramaNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [processingSignature, setProcessingSignature] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    return () => {
      setFirmaPreview(prev => {
        if (prev && typeof prev === 'string' && prev.startsWith('blob:')) {
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

    setForm((p) => ({ ...p, nombre: nombreGuardado || p.nombre, email: correoGuardado || p.email }));
  }, []);

useEffect(() => {
  if (!token) return;
  const controller = new AbortController();

  (async () => {
    try {
      const { data } = await axios.get('/api/docentes/perfil', {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      setForm((p) => ({
        ...p,
        dni: data.dni || '',
        facultad: data.facultad_id || '',
        programaAcademico: data.programa_id || '',
        celular: data.celular || '',
      }));
      setFacultadNombre(data.facultad_nombre || '');
      setProgramaNombre(data.programa_nombre || '');
    } catch (err) {
      if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED' || err?.message === 'canceled') return;
      console.error('Error al obtener perfil:', err);
      await alertError('Error al cargar perfil', err.response?.data?.message || 'Inténtalo más tarde.');
    }
  })();

  return () => controller.abort();
}, [token]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (processingSignature) {
    await alertInfo('Procesando firma', 'La firma se está procesando. Espera un momento.');
    return;
  }

  if (!form.nombre || !form.dni || !form.email || !form.facultad || !form.programaAcademico || !form.celular || !firma) {
    await alertWarning('Faltan datos', 'Por favor completa todos los campos requeridos.');
    return;
  }
  if (!/^\d{8}$/.test(form.dni)) {
    toastWarning('DNI inválido', { text: 'El DNI debe contener exactamente 8 dígitos numéricos.' });
    return;
  }

  if (!/^\d{9}$/.test(form.celular)) {
    toastWarning('Celular inválido', { text: 'El número debe contener exactamente 9 dígitos numéricos.' });
    return;
  }

  const id_usuario = localStorage.getItem('id_usuario');
  if (!id_usuario) {
    await alertError('ID de usuario faltante', 'No se encontró el ID de usuario. Por favor inicia sesión nuevamente.');
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

  alertSuccess('Perfil actualizado', 'Tu perfil se actualizó correctamente').then(() => {
    navigate('/dashboard-docente');
  });

  } catch (error) {
    console.error('Error al registrar docente:', error);
    alertError('Error al registrar docente', error.response?.data?.message || 'No se pudo registrar el docente');
  } finally {
    setLoading(false);
  }
  };


  const handleCelularChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,9}$/.test(value)) {
      setForm((p) => ({ ...p, celular: value }));
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
    onClick={() => toggleSidebar()} 
  ></div>
)}
      <Header onToggleSidebar={toggleSidebar} />
      <main className={`main-content${isMobile && !collapsed ? ' sidebar-open' : collapsed ? ' collapsed' : ''}`}>
  <div className="perfil-docente-container">

    <div className="perfil-docente-card">
      <h3 className="perfil-docente-subtitle">Datos Docente</h3>
      <form onSubmit={handleSubmit}>
          <div className="perfil-docente-field">
        <label>Nombre Completo</label>
        <input type="text" value={form.nombre} disabled />
      </div>

        <div className="perfil-docente-field">
        <label>DNI</label>
        <input
          type="text"
          value={form.dni}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,8}$/.test(value)) {
              setForm((p) => ({ ...p, dni: value }));
            }
          }}
          maxLength={8}
          required
          placeholder="Ingrese su DNI"
        />
        <small className="editable-hint">Debe tener 8 dígitos numéricos</small>
      </div>

        <div className="perfil-docente-field">
        <label>Correo Institucional</label>
        <input type="email" value={form.email} disabled />
      </div>

       <div className="perfil-docente-field">
        <label>Facultad</label>
        <input type="text" value={facultadNombre} disabled />
      </div>

       <div className="perfil-docente-field">
        <label>Programa Académico</label>
        <input type="text" value={programaNombre} disabled />
      </div>

      <div className="perfil-docente-field">
      <label>Celular</label>
      <input
        type="text"
        value={form.celular}
        onChange={handleCelularChange}
        maxLength={9}
        inputMode="numeric"
        pattern="\d*"
        placeholder="Celular"
        required
      />
      <small className="editable-hint">Puedes modificar este campo</small>
    </div>

        <div className="firma-section">
        <h3 className="firma-title">Sube tu firma escaneada</h3>

        <div className="firma-alert">
          <strong>¡Importante!</strong> <span>Recuerda subir tu firma para validar documentos en el sistema.</span>
        </div>

       <div className="firma-upload-box">
      {firmaPreview ? (
        <img src={firmaPreview} alt="Vista previa firma" className="firma-preview-img" />
      ) : (
        <>
          <UploadIcon size={16} color="#555" />
          <p>Haz clic para subir tu firma<br /><span>PNG (MAX. 2MB)</span></p>
        </>
      )}
   {processingSignature && (
    <div className="firma-busy-overlay" aria-live="polite">
      <div className="spinner-lg" />
      <span className="busy-text">Procesando firma…</span>
    </div>
  )}

  <input
    type="file"
    accept="image/png, image/jpeg, image/jpg"
    onChange={async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      // Validate type and size before doing any heavy work
      const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
      const maxBytes = 2 * 1024 * 1024; // 2MB
      if (!allowed.includes(file.type) || file.size > maxBytes) {
        // keep behavior simple: clear preview and inform user
        setFirma(null);
        setFirmaPreview((prev) => {
          if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
          return null;
        });
        alert('Archivo inválido: sube PNG/JPEG y máximo 2MB.');
        return;
      }

      // create preview ASAP
      const tempUrl = URL.createObjectURL(file);
      setFirmaPreview((prev) => {
        if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
        return tempUrl;
      });

      setProcessingSignature(true);

      try {
        // lazy-load heavy library only when needed
        try { await import('@imgly/background-removal'); } catch (_) { /* ignore import errors here; cleanSignature may handle it */ }

        const { file: cleanedFile, previewUrl } = await cleanSignature(file, {
          model: 'small',
          alphaThreshold: 185,
        });

        setFirma(cleanedFile);
        setFirmaPreview((prev) => {
          if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
          return previewUrl;
        });
      } catch (err) {
        console.error('Limpieza falló, uso original:', err);
        setFirma(file);
      } finally {
        setProcessingSignature(false);
      }
    }}
    required
    className="firma-input"
    disabled={processingSignature}
  />
      </div>
      </div>

       <button
        type="submit"
        className="perfil-docente-btn guardar"
        disabled={loading || processingSignature || !firma}
      >
        {loading ? (
          <>
            <div className="spinner" style={{ marginRight: 8 }}></div>
            Actualizando...
          </>
        ) : processingSignature ? (
          <>
            <div className="spinner" style={{ marginRight: 8 }}></div>
            Procesando firma...
          </>
        ) : (
          'Guardar Cambios'
        )}
      </button>
      </form>

      <div className="perfil-docente-footer">
      
      </div>
    </div>
  </div>
</main>
    </>
  );
}

export default PerfilDocente;
