import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import SidebarGestor from '../layout/Sidebar/SidebarGestor.jsx';
import Header from '../layout/Header/Header.jsx';
import EstudianteNuevoModal from '../modals/EstudianteNuevoModal';
import SeguimientoModal from '../modals/SeguimientoModal';
import { useUser } from '../../UserContext';
import useFacultades from '../../hooks/gestor/useFacultades';
import useProgramas from '../../hooks/gestor/useProgramas';
import useDocentes from '../../hooks/gestor/useDocentes';
import useLabores from '../../hooks/gestor/useLabores';
import useLineas from '../../hooks/gestor/useLineas';
import useSupervisores from '../../hooks/gestor/useSupervisores';
import useInformesFinales from '../../hooks/gestor/useInformesFinales';
import useEstudiantes from '../../hooks/gestor/useEstudiantes';
import useSeguimiento from '../../hooks/gestor/useSeguimiento';
import './DashboardGestor.css';


const FacultadesSection = lazy(() => import('./sections/FacultadesSection'));
const ProgramasSection = lazy(() => import('./sections/ProgramasSection'));
const DocentesSection = lazy(() => import('./sections/DocentesSection'));
const LaboresSection = lazy(() => import('./sections/LaboresSection'));
const SeguimientoTramiteSection = lazy(() => import('./sections/SeguimientoTramiteSection'));
const LineasSection = lazy(() => import('./sections/LineasSection'));
const SupervisorSection = lazy(() => import('./sections/SupervisorSection'));
const InformesFinalesSection = lazy(() => import('./sections/InformesFinalesSection'));
const EstudiantesSection = lazy(() => import('./sections/EstudiantesSection'));
const ImpersonateLogin = lazy(() => import('./sections/ImpersonateLogin.jsx'));
const CambiosTiempo = lazy(() => import('./sections/CambiosTiempo.jsx'));
const CambioAsesor = lazy(() => import('./sections/CambioAsesor.jsx'));
const Dasborasd = lazy(() => import('./sections/Dashboard.jsx'));
const EstudiantesConcluidos = lazy(() => import('./sections/EstudiantesConcluidos.jsx'));


function DashboardGestor() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dasborasd');
  const { user } = useUser();
  const token = user?.token;
  const facultadesHook = useFacultades(token);
  const programasHook = useProgramas(token);
  const docentesHook = useDocentes(token);
  const laboresHook = useLabores(token);
  const lineasHook = useLineas(token);
  const supervisoresHook = useSupervisores(token);
  const informesHook = useInformesFinales(token);
  const estudiantesHook = useEstudiantes(token);
  const seguimientoHook = useSeguimiento(token);
  const { fetchFacultades } = facultadesHook;
  const { fetchProgramas } = programasHook;
  const { fetchDocentes } = docentesHook;
  const { fetchLabores } = laboresHook;
  const { fetchLineas } = lineasHook;
  const { fetchSupervisores } = supervisoresHook;
  const { fetchInformesFinales } = informesHook;
  const { fetchEstudiantes } = estudiantesHook;

  useEffect(() => {
    if (activeSection === 'facultades') fetchFacultades();
    if (activeSection === 'programas') fetchProgramas();
    if (activeSection === 'docentes') fetchDocentes();
    if (activeSection === 'labores') fetchLabores();
    if (activeSection === 'lineas') fetchLineas();
    if (activeSection === 'supervisores') fetchSupervisores();
    if (activeSection === 'informes-finales') fetchInformesFinales();
    if (activeSection === 'estudiantes' || activeSection === 'seguimiento.trami') {
      fetchEstudiantes();
    }
  }, [
    activeSection,
    fetchFacultades,
    fetchProgramas,
    fetchDocentes,
    fetchLabores,
    fetchLineas,
    fetchSupervisores,
    fetchInformesFinales,
    fetchEstudiantes
  ]);

  const toggleSidebar = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  return (
    <div className="layout-gestor">
      <Header onToggleSidebar={toggleSidebar} />
      <SidebarGestor
        collapsed={collapsed}
        nombre="Nombre del Gestor"
        onToggleSidebar={toggleSidebar}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className={`dashboard-container-gestor ${collapsed ? "expanded" : ""}`}>
        <h2>Dashboard Gestor UDH</h2>

        <Suspense fallback={<div className="loading-section">Cargando...</div>}>

          {activeSection === 'facultades' && (
            <FacultadesSection
              facultades={facultadesHook.facultades}
              modalNuevaFacultadVisible={facultadesHook.modalNuevaFacultadVisible}
              setModalNuevaFacultadVisible={facultadesHook.setModalNuevaFacultadVisible}
              modalEditarVisible={facultadesHook.modalEditarVisible}
              setModalEditarVisible={facultadesHook.setModalEditarVisible}
              editandoId={facultadesHook.editandoId}
              setEditandoId={facultadesHook.setEditandoId}
              nombreEditado={facultadesHook.nombreEditado}
              setNombreEditado={facultadesHook.setNombreEditado}
              nuevaFacultad={facultadesHook.nuevaFacultad}
              setNuevaFacultad={facultadesHook.setNuevaFacultad}
              eliminarFacultad={facultadesHook.eliminarFacultad}
              cancelarEdicion={facultadesHook.cancelarEdicion}
              guardarEdicionFacultad={facultadesHook.guardarEdicionFacultad}
              crearFacultad={facultadesHook.crearFacultad}
            />
          )}

          {activeSection === 'programas' && (
            <ProgramasSection
              programas={programasHook.programas}
              modalProgramaVisible={programasHook.modalProgramaVisible}
              setModalProgramaVisible={programasHook.setModalProgramaVisible}
              modalEditarProgramaVisible={programasHook.modalEditarProgramaVisible}
              setModalEditarProgramaVisible={programasHook.setModalEditarProgramaVisible}
              idEditandoPrograma={programasHook.idEditandoPrograma}
              setIdEditandoPrograma={programasHook.setIdEditandoPrograma}
              programaEditado={programasHook.programaEditado}
              setProgramaEditado={programasHook.setProgramaEditado}
              facultadEditada={programasHook.facultadEditada}
              setFacultadEditada={programasHook.setFacultadEditada}
              emailEditado={programasHook.emailEditado}
              setEmailEditado={programasHook.setEmailEditado}
              nuevoPrograma={programasHook.nuevoPrograma}
              setNuevoPrograma={programasHook.setNuevoPrograma}
              facultadPrograma={programasHook.facultadPrograma}
              setFacultadPrograma={programasHook.setFacultadPrograma}
              emailPrograma={programasHook.emailPrograma}
              setEmailPrograma={programasHook.setEmailPrograma}
              whatsappPrograma={programasHook.whatsappPrograma}
              setWhatsappPrograma={programasHook.setWhatsappPrograma}
              facultades={facultadesHook.facultades}
              eliminarPrograma={programasHook.eliminarPrograma}
              guardarEdicionPrograma={programasHook.guardarEdicionPrograma}
              crearPrograma={programasHook.crearPrograma}
            />
          )}

          {activeSection === 'supervisores' && (
            <SupervisorSection
              supervisores={supervisoresHook.supervisores}
              busquedaSupervisor={supervisoresHook.busquedaSupervisor}
              setBusquedaSupervisor={supervisoresHook.setBusquedaSupervisor}
              programaSupervisor={supervisoresHook.programaSupervisor}
              setProgramaSupervisor={supervisoresHook.setProgramaSupervisor}
              programas={programasHook.programas}
              eliminarSupervisor={supervisoresHook.eliminarSupervisor}
            />
          )}

          {activeSection === 'informes-finales' && (
            <InformesFinalesSection
              informesFinales={informesHook.informesFinales}
              busquedaDocente={docentesHook.busquedaDocente}
              setBusquedaDocente={docentesHook.setBusquedaDocente}
              programaSeleccionado={programasHook.programaSeleccionado}
              setProgramaSeleccionado={programasHook.setProgramaSeleccionado}
              programas={programasHook.programas}
              aprobandoId={informesHook.aprobandoId}
              aceptarInforme={informesHook.aceptarInforme}
              rechazarInforme={informesHook.rechazarInforme}
            />
          )}

          {activeSection === 'estudiantes' && (
            <EstudiantesSection
              estudiantes={estudiantesHook.estudiantes}
              filtroEstudiantes={estudiantesHook.filtroEstudiantes}
              setFiltroEstudiantes={estudiantesHook.setFiltroEstudiantes}
              programaSeleccionado={programasHook.programaSeleccionado}
              setProgramaSeleccionado={programasHook.setProgramaSeleccionado}
              programas={programasHook.programas}
              setModalEstudianteVisible={estudiantesHook.setModalEstudianteVisible}
            />
          )}

          {activeSection === 'estudiantes-concluidos' && (
            <EstudiantesConcluidos
              estudiantes={estudiantesHook.estudiantes}
              filtroEstudiantes={estudiantesHook.filtroEstudiantes}
              setFiltroEstudiantes={estudiantesHook.setFiltroEstudiantes}
              programas={programasHook.programas}
              programaSeleccionado={programasHook.programaSeleccionado}
              setProgramaSeleccionado={programasHook.setProgramaSeleccionado}
              setModalEstudianteVisible={estudiantesHook.setModalEstudianteVisible}
            />
          )}

          <EstudianteNuevoModal
            isOpen={estudiantesHook.modalEstudianteVisible}
            codigo={estudiantesHook.codigoUniversitario}
            onChangeCodigo={(value) => {
              if (/^\d{0,10}$/.test(value)) {
                estudiantesHook.setCodigoUniversitario(value);
              }
            }}
            whatsapp={docentesHook.nuevoDocenteWhatsapp}
            onChangeWhatsapp={(value) => {
              if (/^\d{0,9}$/.test(value)) {
                docentesHook.setNuevoDocenteWhatsapp(value);
              }
            }}
            onClose={() => {
              estudiantesHook.setModalEstudianteVisible(false);
              estudiantesHook.setCodigoUniversitario('');
              docentesHook.setNuevoDocenteWhatsapp('');
            }}
            onGuardar={async () => {
              const ok = await estudiantesHook.registrarEstudiante(docentesHook.nuevoDocenteWhatsapp);
              if (ok) {
                docentesHook.setNuevoDocenteWhatsapp('');
              }
            }}
          />

          {activeSection === 'docentes' && (
            <DocentesSection
              docentes={docentesHook.docentes}
              busquedaDocente={docentesHook.busquedaDocente}
              setBusquedaDocente={docentesHook.setBusquedaDocente}
              modalDocenteVisible={docentesHook.modalDocenteVisible}
              setModalDocenteVisible={docentesHook.setModalDocenteVisible}
              modalEditarDocenteVisible={docentesHook.modalEditarDocenteVisible}
              setModalEditarDocenteVisible={docentesHook.setModalEditarDocenteVisible}
              editandoDocenteId={docentesHook.editandoDocenteId}
              setEditandoDocenteId={docentesHook.setEditandoDocenteId}
              nombreDocenteEditado={docentesHook.nombreDocenteEditado}
              setNombreDocenteEditado={docentesHook.setNombreDocenteEditado}
              emailDocenteEditado={docentesHook.emailDocenteEditado}
              setEmailDocenteEditado={docentesHook.setEmailDocenteEditado}
              facultadDocenteEditada={docentesHook.facultadDocenteEditada}
              setFacultadDocenteEditada={docentesHook.setFacultadDocenteEditada}
              programaDocenteEditado={docentesHook.programaDocenteEditado}
              setProgramaDocenteEditado={docentesHook.setProgramaDocenteEditado}
              nuevoDocenteEmail={docentesHook.nuevoDocenteEmail}
              setNuevoDocenteEmail={docentesHook.setNuevoDocenteEmail}
              nuevoDocenteWhatsapp={docentesHook.nuevoDocenteWhatsapp}
              setNuevoDocenteWhatsapp={docentesHook.setNuevoDocenteWhatsapp}
              nuevaFacultadDocente={docentesHook.nuevaFacultadDocente}
              setNuevaFacultadDocente={docentesHook.setNuevaFacultadDocente}
              nuevoProgramaDocente={docentesHook.nuevoProgramaDocente}
              setNuevoProgramaDocente={docentesHook.setNuevoProgramaDocente}
              setNuevoDocenteDni={docentesHook.setNuevoDocenteDni}
              facultades={facultadesHook.facultades}
              programas={docentesHook.programasFiltrados}
              eliminarDocente={docentesHook.eliminarDocente}
              guardarEdicionDocente={docentesHook.guardarEdicionDocente}
              crearDocente={docentesHook.crearDocente}
            />
          )}

          {activeSection === 'cambios-tiempo' && (
            <CambiosTiempo />
          )}

          {activeSection === 'cambio-asesor' && (
            <CambioAsesor />
          )}

          {activeSection === 'dasborasd' && (
            <Dasborasd />
          )}

          {activeSection === 'impersonate' && (
            <ImpersonateLogin />
          )}

          {activeSection === 'labores' && (
            <LaboresSection
              labores={laboresHook.labores}
              busquedaLabor={laboresHook.busquedaLabor}
              setBusquedaLabor={laboresHook.setBusquedaLabor}
              modalLaborVisible={laboresHook.modalLaborVisible}
              setModalLaborVisible={laboresHook.setModalLaborVisible}
              modalEditarLaborVisible={laboresHook.modalEditarLaborVisible}
              setModalEditarLaborVisible={laboresHook.setModalEditarLaborVisible}
              editandoLaborId={laboresHook.editandoLaborId}
              setEditandoLaborId={laboresHook.setEditandoLaborId}
              idLaborEditando={laboresHook.idLaborEditando}
              setIdLaborEditando={laboresHook.setIdLaborEditando}
              nombreLaborEditado={laboresHook.nombreLaborEditado}
              setNombreLaborEditado={laboresHook.setNombreLaborEditado}
              nuevaLabor={laboresHook.nuevaLabor}
              setNuevaLabor={laboresHook.setNuevaLabor}
              lineaLabor={laboresHook.lineaLabor}
              setLineaLabor={laboresHook.setLineaLabor}
              lineas={lineasHook.lineas}
              eliminarLabor={laboresHook.eliminarLabor}
              guardarEdicionLabor={laboresHook.guardarEdicionLabor}
              crearLabor={laboresHook.crearLabor}
            />
          )}

          {activeSection === 'seguimiento.trami' && (
            <SeguimientoTramiteSection
              estudiantes={estudiantesHook.estudiantes}
              filtroEstudiantes={estudiantesHook.filtroEstudiantes}
              setFiltroEstudiantes={estudiantesHook.setFiltroEstudiantes}
              verSeguimiento={seguimientoHook.verSeguimiento}
            />
          )}

          {activeSection === 'lineas' && (
            <LineasSection
              lineas={lineasHook.lineas}
              busquedaLinea={lineasHook.busquedaLinea}
              setBusquedaLinea={lineasHook.setBusquedaLinea}
              modalLineaVisible={lineasHook.modalLineaVisible}
              setModalLineaVisible={lineasHook.setModalLineaVisible}
              modalEditarLineaVisible={lineasHook.modalEditarLineaVisible}
              setModalEditarLineaVisible={lineasHook.setModalEditarLineaVisible}
              idEditandoLinea={lineasHook.idEditandoLinea}
              setIdEditandoLinea={lineasHook.setIdEditandoLinea}
              nombreLineaEditado={lineasHook.nombreLineaEditado}
              setNombreLineaEditado={lineasHook.setNombreLineaEditado}
              nuevaLinea={lineasHook.nuevaLinea}
              setNuevaLinea={lineasHook.setNuevaLinea}
              eliminarLinea={lineasHook.eliminarLinea}
              guardarEdicionLinea={lineasHook.guardarEdicionLinea}
              crearLinea={lineasHook.crearLinea}
            />
          )}

        </Suspense>

        <SeguimientoModal
          isOpen={seguimientoHook.modalSeguimientoVisible}
          seguimiento={seguimientoHook.seguimiento}
          onClose={seguimientoHook.cerrarSeguimiento}
        />

      </div>
    </div>
  );
}

export default DashboardGestor;
