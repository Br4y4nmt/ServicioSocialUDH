import React, { Suspense, memo, useEffect, useMemo, useState } from 'react';
import Header from '../layout/Header/Header';
import SidebarDocente from 'components/layout/Sidebar/SidebarDocente';
import VerBoton from "../../hooks/componentes/VerBoton";
import FullScreenSpinner from 'components/ui/FullScreenSpinner';
import { useDashboardDocente } from '../../hooks/docente/useDashboardDocente';
import DocenteModals from './DocenteModals';
import PageSkeleton from '../loaders/PageSkeleton';
import TablePagination from '../ui/TablePagination';
import SearchInput from '../gestor/SearchInput';
import './DashboardDocente.css';

const ESTILOS = {
  flexColumnCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  flexColumnGap: { display: 'flex', flexDirection: 'column', gap: '6px' },
  sinDocumento: { color: '#999', fontSize: '12px' }
};

const RevisionContent = memo(function RevisionContent({
  loading,
  trabajosSociales,
  trabajoEnProcesoId,
  handleVerGrupo,
  handleCambiarEstado,
  abrirModalDeclinar,
  navigate
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 10;

  const trabajosFiltrados = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return trabajosSociales;

    return trabajosSociales.filter((trabajo) => {
      const estudiante = trabajo.Estudiante?.nombre_estudiante || '';
      const programa = trabajo.ProgramasAcademico?.nombre_programa || '';
      const servicio = trabajo.LaboresSociale?.nombre_labores || '';
      const tipo = trabajo.tipo_servicio_social || '';

      return [estudiante, programa, servicio, tipo]
        .some((valor) => String(valor).toLowerCase().includes(term));
    });
  }, [trabajosSociales, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(trabajosFiltrados.length / ITEMS_PER_PAGE));
  const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
  const trabajosSocialesPagina = trabajosFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="revision-container-d">
      <div className="revision-card">
        <div
          style={{
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <h2 className="revision-title" style={{ margin: 0 }}>
            Revisión del Docente
          </h2>

          <SearchInput
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por estudiante"
            label="Buscar:"
            className="docentes-search-label"
          />
        </div>

        <TablaTrabajos
          loading={loading}
          trabajosSociales={trabajosSocialesPagina}
          trabajoEnProcesoId={trabajoEnProcesoId}
          handleVerGrupo={handleVerGrupo}
          handleCambiarEstado={handleCambiarEstado}
          abrirModalDeclinar={abrirModalDeclinar}
          inicio={inicio}
        />

        {!loading && trabajosFiltrados.length > 0 && (
          <TablePagination
            totalItems={trabajosFiltrados.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={(page) => {
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
              }
            }}
          />
        )}
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
  loading,
  trabajosSociales,
  trabajoEnProcesoId,
  handleVerGrupo,
  handleCambiarEstado,
  abrirModalDeclinar,
  inicio
}) {
  if (loading) {
    return (
      <div className="revision-table-wrapper">
        <PageSkeleton xlRows={4} />
      </div>
    );
  }

  if (trabajosSociales.length === 0) {
    return <p className="revision-no-data">No hay trabajos sociales disponibles aún.</p>;
  }

  return (
    <div className="revision-table-wrapper">
      <table className="revision-table">
        <thead className="revision-table-thead">
          <tr>
            <th>N°</th>
            <th>Estudiante</th>
            <th>Programa Académico</th>
            <th>Servicio Social</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
            <th>Documentos</th>
          </tr>
        </thead>
        <tbody>
          {trabajosSociales.map((trabajo, index) => (
            <FilaTrabajo
              key={trabajo.id}
              trabajo={trabajo}
              index={index}
              inicio={inicio}
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
  index,
  inicio,
  trabajoEnProcesoId,
  handleVerGrupo,
  handleCambiarEstado,
  abrirModalDeclinar
}) {
  return (
    <tr>
      <td>{inicio + index + 1}</td>
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
              {trabajoEnProcesoId === trabajo.id ? <FullScreenSpinner /> : 'Aceptar'}
            </button>

        <button
          className="btn-accion rechazar"
          onClick={() => abrirModalDeclinar(trabajo, 'rechazar')}
          disabled={trabajoEnProcesoId === trabajo.id}
        >
          {trabajoEnProcesoId === trabajo.id ? <FullScreenSpinner /> : 'Rechazar'}
        </button>
          </div>
        ) : (
      <button
        className="boton-declinar"
        onClick={() => abrirModalDeclinar(trabajo, 'declinar')}
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
    accionModalDeclinar,
    handleRechazarConObservacion,
    navigate
  } = useDashboardDocente();

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
          loading={loading}
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
          accionModalDeclinar={accionModalDeclinar}
          handleDeclinar={handleDeclinar}
          handleRechazarConObservacion={handleRechazarConObservacion}
          modalGrupoVisible={modalGrupoVisible}
          integrantesGrupo={integrantesGrupo}
          cerrarModalGrupo={cerrarModalGrupo}
        />
      </Suspense>
    </>
  );
}

export default DashboardDocente;