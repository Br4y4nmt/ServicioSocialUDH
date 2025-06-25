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
        const res = await axios.get('http://localhost:5000/api/facultades', {
        headers: { Authorization: `Bearer ${token}` }

      });
        setFacultades(res.data);
      } catch (error) {
        console.error('Error al obtener facultades:', error);
      }
    };

    fetchFacultades();
  }, [token]);

  useEffect(() => {
    const fetchProgramas = async () => {
      if (!perfil.facultad) {
        setProgramas([]);
        return;
      }
      try {
        const res = await axios.get(
        `http://localhost:5000/api/programas/facultad/${perfil.facultad}`,
        {
          headers: { Authorization: `Bearer ${token}` }

        }
      );
        setProgramas(res.data);
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
      facultad,
      programa_academico_id: programa,
      id_usuario: usuario_id,
      codigo,
    };

    await axios.post('http://localhost:5000/api/estudiantes', body, {
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
  const correo = localStorage.getItem('correo_institucional') || '';
  const codigoDesdeCorreo = correo.split('@')[0]; // solo para buscar

  const fetchPerfilDesdeUDH = async () => {
    try {
      const res = await axios.get(`http://www.udh.edu.pe/websauh/secretaria_general/gradosytitulos/datos_estudiante_json.aspx?_c_3456=${codigoDesdeCorreo}`);
      const data = res.data[0];

      const nombre_completo = `${data.stu_nombres || ''} ${data.stu_apellido_paterno || ''} ${data.stu_apellido_materno || ''}`.trim();

      // Buscar ID de facultad por nombre
      const facultadEncontrada = facultades.find(
        (fac) => removerAcentos(fac.nombre_facultad.toLowerCase().trim()) === removerAcentos(data.stu_facultad.toLowerCase().trim())

      );

      let idFacultad = facultadEncontrada?.id_facultad || '';

      let idPrograma = '';
      if (idFacultad) {
        // Buscar programas solo si se encontró la facultad
        const resProgramas = await axios.get(
          `http://localhost:5000/api/programas/facultad/${idFacultad}`,
          {
            headers: { Authorization: `Bearer ${token}` }

          }
        );
        const listaProgramas = resProgramas.data;

        setProgramas(listaProgramas); // para mostrar en el select

        const programaEncontrado = listaProgramas.find(
          (prog) => removerAcentos(prog.nombre_programa.toLowerCase().trim()) === removerAcentos(data.stu_programa.toLowerCase().trim())

        );

        idPrograma = programaEncontrado?.id_programa || '';
      }

      setPerfil((prev) => ({
        ...prev,
        nombre_completo,
        dni: data.stu_dni || '',
        codigo: data.stu_codigo || '',
        facultad: idFacultad,
        programa: idPrograma,
        correo,
      }));
    } catch (error) {
      console.error('Error al obtener datos del estudiante:', error);
    }
  };

  if (correo && facultades.length > 0) {
    fetchPerfilDesdeUDH();
  }
}, [facultades, token]);

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
        `http://localhost:5000/api/programas/facultad/${perfil.facultad}`,
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


            </div>
            <div className="form-group">
              <label className="bold-text">Facultad</label>
              <select
                  name="facultad"
                  value={perfil.facultad}
                  onChange={handleChange}
                  disabled 
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
                  disabled 
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
