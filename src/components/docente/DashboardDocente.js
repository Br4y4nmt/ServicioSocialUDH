import React, { Suspense, memo } from 'react';
import Header from '../layout/Header/Header';
import SidebarDocente from 'components/layout/Sidebar/SidebarDocente';
import VerBoton from "../../hooks/componentes/VerBoton";
import { useDashboardDocente } from '../../hooks/docente/useDashboardDocente';
import DocenteModals from './DocenteModals';
import PageSkeleton from '../loaders/PageSkeleton';
import './DashboardDocente.css';


const ESTILOS = {
  flexColumnCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  flexColumnGap: { display: 'flex', flexDirection: 'column', gap: '6px' },
  sinDocumento: { color: '#999', fontSize: '12px' }
};

const RevisionContent = memo(function RevisionContent({
  trabajosSociales,
  trabajoEnProcesoId,
  handleVerGrupo,
  handleCambiarEstado,
  abrirModalDeclinar,
  navigate
}) {
  return (
    <div className="revision-container-d">
      <div className="revision-card">
        <h2 className="revision-title">Revisión del Docente</h2>

        <TablaTrabajos
          trabajosSociales={trabajosSociales}
          trabajoEnProcesoId={trabajoEnProcesoId}
          handleVerGrupo={handleVerGrupo}
          handleCambiarEstado={handleCambiarEstado}
          abrirModalDeclinar={abrirModalDeclinar}
        />
      </div>

      <div className="revision-footer">
        <button
          className="revision-btn siguiente"
          onClick={() => navigate('/revision-documento-docente')}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
});

const TablaTrabajos = memo(function TablaTrabajos({
  trabajosSociales,
  trabajoEnProcesoId,
  handleVerGrupo,
  handleCambiarEstado,
  abrirModalDeclinar
}) {
  if (trabajosSociales.length === 0) {
    return <p className="revision-no-data">No hay trabajos sociales disponibles aún.</p>;
  }

  return (
    <div className="revision-table-wrapper">
      <table className="revision-table">
        <thead className="revision-table-thead">
          <tr>
            <th>Alumno</th>
            <th>Programa Académico</th>
            <th>Servicio Social</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
            <th>Documentos</th>
          </tr>
        </thead>
        <tbody>
          {trabajosSociales.map((trabajo) => (
            <FilaTrabajo
              key={trabajo.id}
              trabajo={trabajo}
              trabajoEnProcesoId={trabajoEnProcesoId}
              handleVerGrupo={handleVerGrupo}
              handleCambiarEstado={handleCambiarEstado}
              abrirModalDeclinar={abrirModalDeclinar}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

const FilaTrabajo = memo(function FilaTrabajo({
  trabajo,
  trabajoEnProcesoId,
  handleVerGrupo,
  handleCambiarEstado,
  abrirModalDeclinar
}) {
  return (
    <tr>
      <td>{trabajo.Estudiante?.nombre_estudiante || 'No disponible'}</td>
      <td>{trabajo.ProgramasAcademico?.nombre_programa || 'No disponible'}</td>
      <td>{trabajo.LaboresSociale?.nombre_labores || 'No disponible'}</td>
      
      <td>
        <div style={ESTILOS.flexColumnCenter}>
          <span>{trabajo.tipo_servicio_social}</span>
          {trabajo.tipo_servicio_social === 'grupal' && (
            <VerBoton
              label="Ver"
              onClick={() => handleVerGrupo(trabajo.id)}
            />
          )}
        </div>
      </td>

      <td>
        <span
          className={
            trabajo.estado_plan_labor_social === 'aceptado'
              ? 'estado-badge aceptado'
              : trabajo.estado_plan_labor_social === 'pendiente'
              ? 'estado-badge pendiente'
              : 'estado-badge rechazado'
          }
        >
          {trabajo.estado_plan_labor_social}
        </span>
      </td>

      <td>
        {trabajo.estado_plan_labor_social === 'pendiente' ? (
          <div style={ESTILOS.flexColumnGap}>
            <button
              className="btn-accion aceptar"
              onClick={() => handleCambiarEstado(trabajo, 'aceptado')}
              disabled={trabajoEnProcesoId === trabajo.id}
            >
              {trabajoEnProcesoId === trabajo.id ? (
                <>
                  <span className="spinner" />
                  Generando...
                </>
              ) : (
                'Aceptar'
              )}
            </button>

            <button
              className="btn-accion rechazar"
              onClick={() => handleCambiarEstado(trabajo, 'rechazado')}
              disabled={trabajoEnProcesoId === trabajo.id}
            >
              {trabajoEnProcesoId === trabajo.id ? (
                <>
                  <span className="spinner" />
                  Procesando...
                </>
              ) : (
                'Rechazar'
              )}
            </button>
          </div>
        ) : (
          <button
            className="boton-declinar"
            onClick={() => abrirModalDeclinar(trabajo)}
          >
            Declinar
          </button>
        )}
      </td>

      <td>
        {trabajo.estado_plan_labor_social === 'aceptado' ? (
          <VerBoton
            label="Ver"
            onClick={() =>
              window.open(
                `${process.env.REACT_APP_API_URL}/api/trabajo-social/documentos-trabajo/${trabajo.id}`,
                "_blank"
              )
            }
          />
        ) : (
          <span style={ESTILOS.sinDocumento}>SIN DOCUMENTO</span>
        )}
      </td>
    </tr>
  );
});


function DashboardDocente() {
  const {
    isMobile,
    collapsed,
    activeSection,
    setActiveSection,
    loading,
    trabajosSociales,
    modalVisible,
    modalGrupoVisible,
    modalDeclinarVisible,
    nuevoEstado,
    setNuevoEstado,
    integrantesGrupo,
    trabajoEnProcesoId,
    observacionDeclinar,
    setObservacionDeclinar,
    toggleSidebar,
    handleCloseModal,
    handleVerGrupo,
    cerrarModalGrupo,
    handleSave,
    handleCambiarEstado,
    handleDeclinar,
    abrirModalDeclinar,
    cerrarModalDeclinar,
    navigate
  } = useDashboardDocente();

  if (loading) {
    return (
      <>
        <Header onToggleSidebar={() => {}} />
        <SidebarDocente
          collapsed={collapsed}
          nombre={localStorage.getItem('nombre_usuario')}
          onToggleSidebar={() => {}}
          activeSection={activeSection}
          setActiveSection={() => {}}
        />
        <main className={`main-content${collapsed ? ' collapsed' : ''}`}>
          <PageSkeleton />
        </main>
      </>
    );
  }

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <SidebarDocente
        collapsed={collapsed}
        nombre={localStorage.getItem('nombre_usuario')}
        onToggleSidebar={toggleSidebar}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {isMobile && !collapsed && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}

      <main className={`main-content${isMobile && !collapsed ? ' sidebar-open' : collapsed ? ' collapsed' : ''}`}>
        <RevisionContent
          trabajosSociales={trabajosSociales}
          trabajoEnProcesoId={trabajoEnProcesoId}
          handleVerGrupo={handleVerGrupo}
          handleCambiarEstado={handleCambiarEstado}
          abrirModalDeclinar={abrirModalDeclinar}
          navigate={navigate}
        />
      </main>

      <Suspense fallback={null}>
        <DocenteModals
          modalVisible={modalVisible}
          nuevoEstado={nuevoEstado}
          setNuevoEstado={setNuevoEstado}
          handleSave={handleSave}
          handleCloseModal={handleCloseModal}
          modalDeclinarVisible={modalDeclinarVisible}
          observacionDeclinar={observacionDeclinar}
          setObservacionDeclinar={setObservacionDeclinar}
          cerrarModalDeclinar={cerrarModalDeclinar}
          handleDeclinar={handleDeclinar}
          modalGrupoVisible={modalGrupoVisible}
          integrantesGrupo={integrantesGrupo}
          cerrarModalGrupo={cerrarModalGrupo}
        />
      </Suspense>
    </>
  );
}

export default DashboardDocente;
