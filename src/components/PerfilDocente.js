import React, { useState, useEffect } from 'react';
import Header from './Header';
import axios from 'axios';
import SidebarDocente from './SidebarDocente';
import './PerfilDocente.css';  
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../UserContext';
function DashboardDocente() {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [facultad, setFacultad] = useState(''); 
  const [programaAcademico, setProgramaAcademico] = useState('');
  const [celular, setCelular] = useState('');
  const [firma, setFirma] = useState(null);
  const [firmaPreview, setFirmaPreview] = useState(null);
  const { user } = useUser();
  const token = user?.token;
  const [facultadNombre, setFacultadNombre] = useState('');
  const [programaNombre, setProgramaNombre] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };
  useEffect(() => {
    const nombreGuardado = localStorage.getItem('nombre_usuario');
    const correoGuardado = localStorage.getItem('correo_institucional');
  
    if (nombreGuardado) setNombre(nombreGuardado);
    if (correoGuardado) setEmail(correoGuardado);
  }, []);

useEffect(() => {
  const fetchPerfilDocente = async () => {
    try {
      const { data } = await axios.get(
        '/api/docentes/perfil',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDni(data.dni || '');
      setFacultad(data.facultad_id || '');
      setProgramaAcademico(data.programa_id || '');
      setCelular(data.celular || '');
      setFacultadNombre(data.facultad_nombre || '');
      setProgramaNombre(data.programa_nombre || '');

    } catch (err) {
      console.error('Error al obtener perfil:', err);
      Swal.fire({
        icon: 'error',
        title: 'No se pudo cargar el perfil',
        text: err.response?.data?.message || 'Intente nuevamente.',
      });
    }
  };

  if (token) {
    fetchPerfilDocente();
  }
}, [token]);


  // Manejar el submit del formulario
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!nombre || !dni || !email || !facultad || !programaAcademico || !celular || !firma) {
    Swal.fire({
      icon: 'warning',
      title: 'Faltan datos',
      text: 'Por favor complete todos los campos, incluyendo la firma digital.'
    });
    return;
  }
      if (!/^\d{8}$/.test(dni)) {
        Swal.fire({
          icon: 'warning',
          title: 'DNI inválido',
          text: 'Debe contener exactamente 8 dígitos numéricos.'
        });
        return;
      }
  if (!/^\d{9}$/.test(celular)) {
    Swal.fire({
      icon: 'warning',
      title: 'Celular inválido',
      text: 'Debe contener exactamente 9 dígitos numéricos.'
    });
    return;
  }

  const id_usuario = localStorage.getItem('id_usuario');
  if (!id_usuario) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se encontró el ID del usuario. Inicie sesión nuevamente.'
    });
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append('nombre_docente', nombre);
    formData.append('dni', dni);
    formData.append('email', email);
    formData.append('facultad', facultad);
    formData.append('programa_academico_id', programaAcademico);
    formData.append('celular', celular);
    formData.append('id_usuario', id_usuario);
    formData.append('firma_digital', firma); 

     await axios.put('/api/docentes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
  localStorage.setItem('firma_docente_completa', 'true'); 
    Swal.fire({
      icon: 'success',
      title: 'Registro Exitoso',
      text: 'Su perfil se ha completado exitosamente.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false
    }).then(() => {
      navigate('/dashboard-docente');
    });

  } catch (error) {
    console.error('Error al registrar docente:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al registrar el docente.',
      confirmButtonColor: '#d33'
    });
  }finally {
    setLoading(false);
  }
};


const handleCelularChange = (e) => {
  const value = e.target.value;
  if (/^\d{0,9}$/.test(value)) {
    setCelular(value);
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
 {window.innerWidth <= 768 && !collapsed && (
  <div
    className="sidebar-overlay"
    onClick={() => toggleSidebar()} // Llama a tu función para colapsar el sidebar
  ></div>
)}
      <Header onToggleSidebar={toggleSidebar} />
      <main className={`main-content${window.innerWidth <= 768 && !collapsed ? ' sidebar-open' : collapsed ? ' collapsed' : ''}`}>
  <div className="perfil-docente-container">

    <div className="perfil-docente-card">
      <h3 className="perfil-docente-subtitle">Datos Docente</h3>
      <form onSubmit={handleSubmit}>
        <div className="perfil-docente-field">
      <label>Nombre Completo</label>
      <input type="text" value={nombre} disabled />
    </div>

        <div className="perfil-docente-field">
        <label>DNI</label>
        <input
          type="text"
          value={dni}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,8}$/.test(value)) {
              setDni(value);
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
        <input type="email" value={email} disabled />
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
        value={celular}
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
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#555"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 16l-4-4-4 4" />
            <path d="M12 12v9" />
            <path d="M20.39 18.39A5 5 0 0018 10H6a5 5 0 00-2.39 8.39" />
          </svg>
          <p>Haz clic para subir tu firma<br /><span>PNG (MAX. 2MB)</span></p>
        </>
  )}
        <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        onChange={(e) => {
          const file = e.target.files[0];
          setFirma(file);
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setFirmaPreview(reader.result); // ← Guarda la URL base64
            };
            reader.readAsDataURL(file);
          }
        }}
        required
        className="firma-input"
      />
      </div>
      </div>

        <button
        type="submit"
        className="perfil-docente-btn guardar"
        disabled={loading}
      >
       {loading ? (
          <>
            <div className="spinner" style={{ marginRight: '8px' }}></div>
            Actualizando...
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

export default DashboardDocente;
