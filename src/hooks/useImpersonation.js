export function useImpersonation() {
  function salirDeImpersonacion() {
    const originalToken = sessionStorage.getItem('originalToken');
    if (originalToken) {
      localStorage.setItem('authToken', originalToken);
      sessionStorage.removeItem('originalToken');
      window.location.href = '/'; 
    } else {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  }

  return { salirDeImpersonacion };
}
