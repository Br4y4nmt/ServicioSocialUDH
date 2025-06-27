// src/pages/PerfilAlumno.js
import React, { useState, useEffect, useRef } from 'react'; 
import Header from '../components/Header';
import SidebarAlumno from '../components/SidebarAlumno';
import axios from 'axios';
import Swal from 'sweetalert2';
import './DashboardAlumno.css';
import { useUser } from '../UserContext';

function PerfilAlumno() {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
  const sidebarRef = useRef();
  const [nombre, setNombre] = useState('');
  const [facultades, setFacultades] = useState([]);
  const [programas, setProgramas] = useState([]);
  const { user } = useUser();  
  const token = user?.token;
  const [perfil, setPerfil] = useState({
    nombre_completo: '',
    dni: '',
    correo: '',
    celular: '',
    facultad: '',
    programa: '',
    codigo: '',
  });

    const handleClickOutside = (event) => {
    // Verificamos si el clic es fuera del sidebar
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setCollapsed(true); // Colapsamos el sidebar si se hace clic fuera
    }
  };

  useEffect(() => {
    // Añadimos un listener de click
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Limpiamos el listener cuando el componente se desmonte
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
const removerAcentos = (texto) => {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

  useEffect(() => {
  setNombre(localStorage.getItem('nombre_usuario') || 'NOMBRE DEL ALUMNO');

  // Cargar facultades al inicio
  const fetchFacultades = async () => {
    try {
      const res = await axios.get('/api/facultades', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Asegurarse de que las facultades sean un array válido
      if (Array.isArray(res.data)) {
        setFacultades(res.data);
      } else {
        setFacultades([]); // En caso de que no sea un array, asignamos un array vacío
      }
    } catch (error) {
      console.error('Error al obtener facultades:', error);
    }
  };

  fetchFacultades();
}, [token]);


useEffect(() => {
  const fetchProgramas = async () => {
    if (!perfil.facultad) {
      setProgramas([]);  // Si no se ha seleccionado facultad, limpiamos los programas
      return;
    }
    try {
      // Solicita los programas de la facultad seleccionada
      const res = await axios.get(`/api/programas/facultad/${perfil.facultad}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Verificamos si res.data es un array válido
      if (Array.isArray(res.data)) {
        setProgramas(res.data);  // Actualizamos los programas con la respuesta
      } else {
        setProgramas([]);  // Si no es un array válido, limpiamos el estado
      }
    } catch (error) {
      console.error('Error al obtener programas:', error);
    }
  };

  fetchProgramas();
}, [perfil.facultad, token]);




  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil((prev) => ({ ...prev, [name]: value }));
  };

const handleGuardar = async () => {
  const usuario_id = localStorage.getItem('id_usuario');
  const { nombre_completo, dni, correo, celular, facultad, programa, codigo } = perfil;

  // Validación de campos vacíos
  if (!nombre_completo || !dni || !correo || !celular || !facultad || !programa || !codigo) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor complete todos los campos obligatorios.',
      confirmButtonColor: '#d33'
    });
    return;
  }

  // Validación de celular: exactamente 9 dígitos
  const celularRegex = /^\d{9}$/;
  if (!celularRegex.test(celular)) {
    Swal.fire({
      icon: 'error',
      title: 'Celular inválido',
      text: 'El número de celular debe contener exactamente 9 dígitos.',
      confirmButtonColor: '#d33'
    });
    return;
  }

  try {
    const body = {
      nombre_estudiante: nombre_completo,
      dni,
      email: correo,
      celular,
      facultad, // Enviar el ID de la facultad
      programa_academico_id: programa, // Enviar el ID del programa
      id_usuario: usuario_id,
      codigo,
    };

    await axios.post('/api/estudiantes', body, {
      headers: { Authorization: `Bearer ${token}` }
    });

    Swal.fire({
      icon: 'success',
      title: 'Perfil guardado',
      text: 'Tu perfil se ha guardado correctamente.',
      confirmButtonColor: '#28a745',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      window.location.href = '/dashboard-alumno';
    });

  } catch (error) {
    console.error('Error al guardar perfil:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: 'Ocurrió un error al guardar el perfil.',
      confirmButtonColor: '#d33'
    });
  }
};

useEffect(() => {
  const correoDesdeLocalStorage = localStorage.getItem('correo_institucional') || '';  // Traemos el correo desde localStorage
  const codigoDesdeCorreo = correoDesdeLocalStorage.split('@')[0]; 
  const correo = localStorage.getItem('correo_institucional') || '';
  const fetchPerfilDesdeBackend = async () => {
    try {
      const res = await axios.get(`/api/estudiantes/perfil-estudiante/${codigoDesdeCorreo}`);
      const data = res.data;

      const nombre_completo = data.nombre_completo;
      const dni = data.dni;
      const codigo = data.codigo;
      const correoCompleto = correo;  
      const facultad = data.facultad;
      const programa = data.programa;

      // 1. Buscar el ID de la facultad por el nombre
      const facultadEncontrada = facultades.find(
        (fac) => removerAcentos(fac.nombre_facultad.toLowerCase().trim()) === removerAcentos(facultad.toLowerCase().trim())
      );
      const idFacultad = facultadEncontrada?.id_facultad || '';

      // 2. Buscar el ID del programa por el nombre
      const programaEncontrado = programas.find(
        (prog) => removerAcentos(prog.nombre_programa.toLowerCase().trim()) === removerAcentos(programa.toLowerCase().trim())
      );
      const idPrograma = programaEncontrado?.id_programa || '';

      // 3. Actualizar el estado del perfil con los IDs de facultad y programa
      setPerfil(prev => ({
        ...prev,
        nombre_completo,
        dni,
        codigo,
        correo: correoCompleto,  
        facultad: idFacultad, 
        programa: idPrograma,  
      }));

    } catch (error) {
      console.error('Error al obtener los datos del perfil:', error);
    }
  };

  if (correoDesdeLocalStorage && facultades.length > 0) {
    fetchPerfilDesdeBackend();
  }
}, [facultades, programas, token]);

const handleCelularChange = (e) => {
  const value = e.target.value;
  if (/^\d{0,9}$/.test(value)) {
    setPerfil((prev) => ({ ...prev, celular: value }));
  }
};

// useEffect para cargar programas si perfil.facultad cambia
useEffect(() => {
  const cargarProgramasSiFacultadValida = async () => {
    if (!perfil.facultad) return;

    try {
     const res = await axios.get(
        `/api/programas/facultad/${perfil.facultad}`,
        {
          headers: { Authorization: `Bearer ${token}` }

        }
      );
      const listaProgramas = res.data;
      setProgramas(listaProgramas);
    } catch (error) {
      console.error('Error al obtener programas:', error);
    }
  };

  cargarProgramasSiFacultadValida();
}, [perfil.facultad]);

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
       <SidebarAlumno
        collapsed={collapsed}
        nombre={nombre}
        onToggleSidebar={toggleSidebar}
        activeSection={'perfil'}
        setActiveSection={() => {}}
      />
      <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        
          <h1 className="dashboard-title">Mi Perfil</h1>
          <div className="card-section">
            <div className="form-group">
              <label className="bold-text">Nombre Completo</label>
              <input
                name="nombre_completo"
                className="input-disabled"
                value={perfil.nombre_completo}
                disabled
              />

            </div>
            <div className="form-group">
              <label className="bold-text">DNI</label>
              <input
              name="dni"
              className="input-disabled"
              value={perfil.dni}
              disabled
            />
            </div>
            <div className="form-group">
              <label className="bold-text">Código</label>
                <input
                name="codigo"
                className="input-disabled"
                value={perfil.codigo}
                disabled
              />

            </div>
            <div className="form-group">
              <label className="bold-text">Correo Institucional</label>
               <input
                name="correo"
                className="input-disabled"
                value={perfil.correo}
                disabled
              />
            </div>

            <div className="form-group">
            <label className="bold-text">Número Celular</label>
            <input
              name="celular"
              className="input-editable"
              value={perfil.celular}
              onChange={handleCelularChange}
              maxLength={9}
              pattern="\d*"
              inputMode="numeric"
            />
            <small className="text-muted">Campo obligatorio</small>
          </div>


           <div className="form-group">
              <label className="bold-text">Facultad</label>
              <select
                name="facultad"
                value={perfil.facultad}
                onChange={handleChange}
                disabled // Actualiza el valor seleccionado cuando el usuario cambia
              >
                <option value="">Seleccione Facultad</option>
                {facultades.map((fac) => (
                  <option key={fac.id_facultad} value={fac.id_facultad}>
                    {fac.nombre_facultad}  
                  </option>
                ))}
              </select>
            </div>


            <div className="form-group">
          <label className="bold-text">Programa Académico</label>
          <select
            name="programa"
            value={perfil.programa}
            onChange={handleChange}
            disabled // Actualiza el valor seleccionado cuando el usuario cambia
          >
            <option value="">Seleccione Programa</option>
            {programas.map((prog) => (
              <option key={prog.id_programa} value={prog.id_programa}>
                {prog.nombre_programa}  
              </option>
            ))}
          </select>
        </div>

            <div className="button-container">
              <button className="btn-completar-perfil" onClick={handleGuardar}>
                Guardar Cambios
              </button>
            </div>
          </div>
        
      </main>
    </>
  );
}

export default PerfilAlumno;
