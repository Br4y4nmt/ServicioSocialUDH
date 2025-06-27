import React from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './UserContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardDocente from './components/DashboardDocente';
import DashboardAlumno from './components/DashboardAlumno';
import 'bootstrap/dist/css/bootstrap.min.css';
import DocumentosTrabajo from './components/DocumentosTrabajo';
import '@fortawesome/fontawesome-free/css/all.min.css';
import MiPerfilDocente from './components/MiPerfilDocente';
import SeguimientoServicioDocente from './components/SeguimientoServicioDocente';
import DashboardGestor from './components/DashboardGestor';
import DashboardProgramaAcademico from './components/DashboardProgramaAcademico';
import RevisionPlanSocial from './components/RevisionPlanSocial';
import RevisionDocente from './components/RevisionDocente';
import PerfilDocente from './components/PerfilDocente';
import MiPerfil from './components/MiPerfil';
import PerfilAlumno from './components/PerfilAlumno';
import './App.css';

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/perfil" element={
            <ProtectedRoute>
              <PerfilAlumno />
            </ProtectedRoute>
          } />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/revision-documento-docente" element={
          <ProtectedRoute allowedRoles={['docente supervisor']}>
            <RevisionPlanSocial />
          </ProtectedRoute>
        } />
        <Route path="/seguimiento-docente" element={
            <ProtectedRoute allowedRoles={['docente supervisor']}>
              <SeguimientoServicioDocente />
            </ProtectedRoute>
          } />
        <Route path="/perfil-docente" element={
          <ProtectedRoute allowedRoles={['docente supervisor']}>
            <PerfilDocente />
          </ProtectedRoute>
        } />
        <Route path="/mi-perfil-docente" element={
          <ProtectedRoute allowedRoles={['docente supervisor']}>
            <MiPerfilDocente />
          </ProtectedRoute>
        } />
        <Route path="/revision-docente" element={
          <ProtectedRoute allowedRoles={['docente supervisor']}>
            <RevisionDocente />
          </ProtectedRoute>
        } />
         <Route path="/dashboard-programa-academico" element={
          <ProtectedRoute allowedRoles={['programa-academico']}>
            <DashboardProgramaAcademico />
          </ProtectedRoute>
        } />
        <Route path="/mi-perfil" element={
          <ProtectedRoute>
            <MiPerfil />
          </ProtectedRoute>
        } />
        <Route path="/dashboard-alumno" element={
        <ProtectedRoute allowedRoles={['alumno']}>
          <DashboardAlumno />
        </ProtectedRoute>
      } />
     
        <Route path="/documentos-trabajo/:id" element={<DocumentosTrabajo />} />
        <Route path="/dashboard-gestor" element={
          <ProtectedRoute allowedRoles={['gestor-udh']}>
          <DashboardGestor />
          </ProtectedRoute>
        } />
        <Route path="/dashboard-docente" element={
          <ProtectedRoute allowedRoles={['docente supervisor']}>
          <DashboardDocente />
          </ProtectedRoute>
        } />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
