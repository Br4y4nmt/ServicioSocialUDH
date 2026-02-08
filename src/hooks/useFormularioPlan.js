import { useState } from 'react';

/**
 * Hook que agrupa todos los estados de formulario del plan de servicio social
 * e informe final. Son estados puros sin side effects.
 */
export function useFormularioPlan() {
  // ── Datos del plan / esquema ──
  const [introduccion, setIntroduccion] = useState('');
  const [justificacion, setJustificacion] = useState('');
  const [objetivoGeneral, setObjetivoGeneral] = useState('');
  const [objetivosEspecificos, setObjetivosEspecificos] = useState('');
  const [metodologiaIntervencion, setMetodologiaIntervencion] = useState('');
  const [recursosRequeridos, setRecursosRequeridos] = useState('');
  const [resultadosEsperados, setResultadosEsperados] = useState('');
  const [nombreEntidad, setNombreEntidad] = useState('');
  const [misionVision, setMisionVision] = useState('');
  const [areasIntervencion, setAreasIntervencion] = useState('');
  const [ubicacionPoblacion, setUbicacionPoblacion] = useState('');
  const [areaInfluencia, setAreaInfluencia] = useState('');
  const [fechaPresentacion, setFechaPresentacion] = useState('');
  const [periodoEstimado, setPeriodoEstimado] = useState('');
  const [nombreInstitucion, setNombreInstitucion] = useState('');
  const [nombreResponsable, setNombreResponsable] = useState('');
  const [lineaAccion, setLineaAccion] = useState('');
  const [antecedentes, setAntecedentes] = useState('');

  // ── Campos del informe final ──
  const [conclusionesInforme, setConclusionesInforme] = useState('');
  const [recomendacionesInforme, setRecomendacionesInforme] = useState('');
  const [anexosInforme, setAnexosInforme] = useState('');
  const [areaInfluenciaInforme, setAreaInfluenciaInforme] = useState('');
  const [recursosUtilizadosInforme, setRecursosUtilizadosInforme] = useState('');
  const [metodologiaInforme, setMetodologiaInforme] = useState('');
  const [objetivoGeneralInforme, setObjetivoGeneralInforme] = useState('');
  const [objetivosEspecificosInforme, setObjetivosEspecificosInforme] = useState('');

  // ── Archivos anexos ──
  const [imagenesAnexos, setImagenesAnexos] = useState({
    cartaAceptacion: null,
    datosContacto: null,
    organigrama: null,
    documentosAdicionales: null,
  });

  return {
    introduccion, setIntroduccion,
    justificacion, setJustificacion,
    objetivoGeneral, setObjetivoGeneral,
    objetivosEspecificos, setObjetivosEspecificos,
    metodologiaIntervencion, setMetodologiaIntervencion,
    recursosRequeridos, setRecursosRequeridos,
    resultadosEsperados, setResultadosEsperados,
    nombreEntidad, setNombreEntidad,
    misionVision, setMisionVision,
    areasIntervencion, setAreasIntervencion,
    ubicacionPoblacion, setUbicacionPoblacion,
    areaInfluencia, setAreaInfluencia,
    fechaPresentacion, setFechaPresentacion,
    periodoEstimado, setPeriodoEstimado,
    nombreInstitucion, setNombreInstitucion,
    nombreResponsable, setNombreResponsable,
    lineaAccion, setLineaAccion,
    antecedentes, setAntecedentes,
    conclusionesInforme, setConclusionesInforme,
    recomendacionesInforme, setRecomendacionesInforme,
    anexosInforme, setAnexosInforme,
    areaInfluenciaInforme, setAreaInfluenciaInforme,
    recursosUtilizadosInforme, setRecursosUtilizadosInforme,
    metodologiaInforme, setMetodologiaInforme,
    objetivoGeneralInforme, setObjetivoGeneralInforme,
    objetivosEspecificosInforme, setObjetivosEspecificosInforme,
    imagenesAnexos, setImagenesAnexos,
  };
}
