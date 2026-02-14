import React from 'react';
import ProtectedRoute from './components/routes/ProtectedRoute';
import { UserProvider } from './UserContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/Login/LoginPage';
import RegisterPage from './components/auth/Register/RegisterPage';
import DashboardDocente from './components/docente/DashboardDocente';
import DashboardAlumno from './components/alumno/DashboardAlumno';
import 'bootstrap/dist/css/bootstrap.min.css';
import DocumentosTrabajo from './components/DocumentosTrabajo';
import '@fortawesome/fontawesome-free/css/all.min.css';
import MiPerfilDocente from './components/docente/MiPerfilDocente';
import SeguimientoServicioDocente from './components/docente/sections/SeguimientoServicioDocente';
import DashboardGestor from './components/gestor/DashboardGestor';
import RevisionPlanSocial from './components/docente/sections/RevisionPlanSocial';
import PerfilDocente from './components/docente/PerfilDocente';
import MiPerfil from './components/alumno/MiPerfil';
import Dasborasd from "./components/gestor/sections/Dashboard";
import PerfilAlumno from './components/alumno/PerfilAlumno';
import './App.css';

function App() {
  return (
    <UserProvider>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
        <Route path="/mi-perfil" element={
          <ProtectedRoute>
            <MiPerfil />
          </ProtectedRoute>
        } />
        <Route
          path="/dasborasd"
          element={
            <ProtectedRoute allowedRoles={['gestor-udh']}>
              <Dasborasd />
            </ProtectedRoute>
          }
        />
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
