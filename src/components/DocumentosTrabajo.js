import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function DocumentosTrabajo() {
  const { id } = useParams();
  const token = localStorage.getItem('token');
    useEffect(() => {

    axios.get(`/api/trabajo-social/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
      .then(res => {
        const archivo = res.data.carta_aceptacion_pdf;
        if (archivo) {
          const url = `/uploads/planes_labor_social/${archivo}`;
          window.open(url, '_blank');
          const link = document.createElement('a');
          link.href = url;
          link.download = archivo;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert('No se ha generado aún el documento PDF para este trabajo.');
        }
      })
      .catch(err => {
        console.error("Error al obtener datos:", err);
        alert('Error al obtener el documento.');
      });
  }, [id, token])

}

export default DocumentosTrabajo;
