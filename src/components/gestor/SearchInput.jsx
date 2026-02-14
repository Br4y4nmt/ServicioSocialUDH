import React from 'react';
import './SearchInput.css';

/**
 * Componente de búsqueda reutilizable con estilos consistentes
 * @param {Object} props - Props del componente
 * @param {string} props.value - Valor actual del input
 * @param {function} props.onChange - Función llamada al cambiar el valor
 * @param {string} props.placeholder - Texto placeholder del input
 * @param {string} props.label - Etiqueta del input (opcional)
 * @param {string} props.className - Clases CSS adicionales (opcional)
 */
const SearchInput = ({ 
  value = '', 
  onChange, 
  placeholder = 'Buscar...', 
  label = 'Buscar:', 
  className = '' 
}) => {
  return (
    <label className={`search-input-label ${className}`}>
      {label}
      <input
        type="text"
        className="search-input-field"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
};

export default SearchInput;