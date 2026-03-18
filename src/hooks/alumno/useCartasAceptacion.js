import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
  mostrarInfoSinCartasGrupo,
  mostrarErrorCargarCartasGrupo
} from '../alerts/alertas';

export function useCartasAceptacion(trabajoId, solicitudEnviada, estadoPlan, tipoServicio, token) {
  const [cartasMiembros, setCartasMiembros] = useState([]);

  const verCartasMiembros = useCallback(async (id) => {
    if (!id) return;

    try {
      const { data } = await axios.get(`/api/cartas-aceptacion/grupo/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (Array.isArray(data) && data.length > 0) {
        setCartasMiembros(data);
      } else {
        setCartasMiembros([]);
        if (estadoPlan === 'aceptado' && tipoServicio === 'grupal') {
          mostrarInfoSinCartasGrupo();
        }
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarErrorCargarCartasGrupo();
    }
  }, [token, estadoPlan, tipoServicio]);

  useEffect(() => {
    if (solicitudEnviada && trabajoId && token) {
      verCartasMiembros(trabajoId);
    }
  }, [solicitudEnviada, trabajoId, token, verCartasMiembros]);

  const resetCartas = useCallback(() => {
    setCartasMiembros([]);
  }, []);

  return { cartasMiembros, resetCartas };
}
