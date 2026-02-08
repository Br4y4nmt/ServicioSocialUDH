/**
 * Normaliza texto removiendo tildes y caracteres especiales para búsqueda
 * @param {string} texto - Texto a normalizar
 * @returns {string} - Texto normalizado sin tildes
 */
export const normalizarTexto = (texto) => {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remueve diacríticos (tildes, acentos)
};

/**
 * Verifica si un texto contiene otro texto, ignorando tildes y mayúsculas
 * @param {string} texto - Texto donde buscar
 * @param {string} busqueda - Término de búsqueda
 * @returns {boolean} - True si encuentra coincidencia
 */
export const buscarSinTildes = (texto, busqueda) => {
  if (!busqueda) return true;
  const textoNormalizado = normalizarTexto(texto);
  const busquedaNormalizada = normalizarTexto(busqueda);
  return textoNormalizado.includes(busquedaNormalizada);
};