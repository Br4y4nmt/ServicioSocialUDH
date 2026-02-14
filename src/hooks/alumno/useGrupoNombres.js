import { useMemo, useCallback } from 'react';

export function useGrupoNombres(nombresMiembros) {
  // Mapa de nombres por correo para búsqueda O(1)
  const nombresPorCorreo = useMemo(() => {
    const map = {};
    for (const n of nombresMiembros) {
      const key = (n.correo || '').trim().toLowerCase();
      map[key] = n.nombre;
    }
    return map;
  }, [nombresMiembros]);

  // Helper para obtener nombre de miembro
  const getNombreMiembro = useCallback((codigoUniversitario) => {
    const correo = `${codigoUniversitario}@udh.edu.pe`.toLowerCase();
    const nombre = nombresPorCorreo[correo];
    return nombre && nombre !== "NO ENCONTRADO" ? nombre : codigoUniversitario;
  }, [nombresPorCorreo]);

  return { getNombreMiembro };
}
