export function useImpersonation() {
  function salirDeImpersonacion() {
    const originalToken = sessionStorage.getItem('originalToken');
    const originalNombre = sessionStorage.getItem('originalNombre');
    const originalFoto = sessionStorage.getItem('originalFoto');
    
    if (originalToken) {
      // Restaurar token y datos del gestor original
      localStorage.setItem('authToken', originalToken);
      if (originalNombre) {
        localStorage.setItem('nombre', originalNombre);
        localStorage.setItem('nombre_usuario', originalNombre);
      }
      if (originalFoto) {
        localStorage.setItem('foto_perfil', originalFoto);
      }
      
      // Limpiar datos de impersonación
      sessionStorage.removeItem('originalToken');
      sessionStorage.removeItem('originalNombre');
      sessionStorage.removeItem('originalFoto');
      
      window.location.href = '/dashboard-gestor';
    } else {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  }

  return { salirDeImpersonacion };
}
