import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
  mostrarInfoSinCartasGrupo,
  mostrarErrorCargarCartasGrupo
} from '../alerts/alertas';

export function useCartasAceptacion(trabajoId, solicitudEnviada, estadoPlan, tipoServicio, token) {
  const [cartasMiembros, setCartasMiembros] = useState([]);
  const [nombresMiembros, setNombresMiembros] = useState([]);

  const obtenerNombresMiembros = useCallback(async (codigos) => {
    try {
      const correos = codigos.map(cod => `${cod}@udh.edu.pe`);
      const { data } = await axios.post('/api/estudiantes/grupo-nombres',
        { correos },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNombresMiembros(data);
    } catch (error) {
      console.error('Error al obtener nombres:', error);
      setNombresMiembros([]);
    }
  }, [token]);

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
        const codigos = data.map((c) => c.codigo_universitario);
        await obtenerNombresMiembros(codigos);
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
  }, [token, obtenerNombresMiembros, estadoPlan, tipoServicio]);

  useEffect(() => {
    if (solicitudEnviada && trabajoId && token) {
      verCartasMiembros(trabajoId);
    }
  }, [solicitudEnviada, trabajoId, token, verCartasMiembros]);

  const resetCartas = useCallback(() => {
    setCartasMiembros([]);
    setNombresMiembros([]);
  }, []);

  return { cartasMiembros, nombresMiembros, resetCartas };
}
