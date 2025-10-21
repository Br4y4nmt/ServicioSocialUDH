// src/components/alumno/InformeFinalPDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Estilos del PDF
const styles = StyleSheet.create({
page: {
  paddingTop: 40,
  paddingBottom: 40,
  paddingLeft: 60,     // antes 40
  paddingRight: 60,    // antes 40
  fontSize: 12,
  fontFamily: 'Times-Roman',
  lineHeight: 1.6,
  textAlign: 'center',
},
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
logoGrande: {
    width: 280,
    height: 180,
    marginVertical: 10,
  },
  colFecha: {
  width: '10%',
  fontSize: 10,
  wordWrap: 'break-word'
},
colFechaFin: {
  width: '10%',
  fontSize: 10,
  wordWrap: 'break-word'
},

tableContainer: {
  display: 'table',
  width: '100%',
  borderStyle: 'solid',
  borderColor: '#ccc', // ✅ color de borde más suave
  borderWidth: 1,
  borderRightWidth: 0,
  borderBottomWidth: 0,
  marginTop: 10,
  fontSize: 11,
},
subHeaderIndented: {
  fontSize: 12,
  fontWeight: 'bold',
  marginTop: 10,
  marginBottom: 4,
  paddingLeft: 20, // Sangría a la derecha
  textAlign: 'left',
  textTransform: 'uppercase',
},
tableRow: {
  flexDirection: 'row',
  minHeight: 20,
},

tableColHeader: {
  borderStyle: 'solid',
  borderBottomWidth: 1,
  borderRightWidth: 1,
  borderColor: '#ccc',
  backgroundColor: '#f2f2f2', // ✅ tono gris claro (como Word)
  padding: 6,
  fontWeight: 'bold',
  textAlign: 'center',
  minHeight: 28,
  fontSize: 11,
},

anexosPage: {
  fontSize: 30,
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  display: 'flex',
},

anexosTitle: {
  fontSize: 28,
  fontWeight: 'bold',
  textTransform: 'uppercase',
},
tableCol: {
  borderStyle: 'solid',
  borderBottomWidth: 1,
  borderRightWidth: 1,
  borderColor: '#ccc',
  padding: 6,
  textAlign: 'left',
  flexWrap: 'wrap',
  lineHeight: 1.3,
  wordBreak: 'break-word',
  fontSize: 10.5,
},
colActividad: { width: '25%' },
colJustificacion: { width: '25%' },
colFecha: { width: '10%', textAlign: 'center' },
colFechaFin: { width: '10%', textAlign: 'center' },
colResultados: { width: '30%' },



  universidad: {
    fontSize: 13,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  facultadBold: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
programaBold: {
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 10,
  textAlign: 'center',
  alignSelf: 'center',
  maxWidth: '75%', // o menos si el texto es largo
},


  titulo: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  subtitulo: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  value: {
    marginBottom: 5
  },
dataContainer: {
  textAlign: 'left',
  marginTop: 60,
  paddingLeft: 40,
  fontSize: 13, // Aumentado (antes 12)
},
  label: {
    fontWeight: 'bold'
  },
  labelBold: {
    fontWeight: 'bold',
  },
  textItem: {
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 11,
  },
  section: {
  marginBottom: 25,  // antes 15
  textAlign: 'left',
},
  line: {
    height: 1,
    backgroundColor: '#000',
    marginHorizontal: 60,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10
  },
});


const InformeFinalPDF = ({
  nombreFacultad,
  nombrePrograma,
  nombreCompleto,
  codigoUniversitario,
  nombreLaborSocial,
  nombreInstitucion,
  nombreResponsable,
  periodoEstimado,
  antecedentes,
  objetivoGeneralInforme,
  objetivosEspecificosInforme,
  actividadesSeguimiento,
  areaInfluenciaInforme,
  recursosUtilizadosInforme,
  metodologiaInforme,
  conclusionesInforme,
  recomendacionesInforme
}) => (
   <Document>
    <Page style={styles.page}>
  {/* Títulos Institucionales */}
  <Text style={styles.universidad}>UNIVERSIDAD DE HUÁNUCO</Text>
<Text style={styles.facultadBold}>FACULTAD DE {nombreFacultad.toUpperCase()}</Text>
<Text style={styles.programaBold}>PROGRAMA ACADÉMICO DE {nombrePrograma.toUpperCase()}</Text>


  {/* Logo Grande */}
  <View style={styles.logoContainer}>
    <Image src="/images/logonuevo.png" style={styles.logoGrande} />
  </View>

  {/* Título sin líneas */}
  <Text style={styles.titulo}>INFORME FINAL DE SERVICIO SOCIAL </Text>

  {/* Subtítulo con líneas arriba y abajo */}
  <View style={styles.line} />
  <Text style={styles.subtitulo}>"{nombreLaborSocial}"</Text>
  <View style={styles.line} />

  {/* Datos */}
  <View style={styles.dataContainer}>
    <Text style={styles.textItem}><Text style={styles.labelBold}>Nombre Completo:</Text> {nombreCompleto}</Text>
    <Text style={styles.textItem}><Text style={styles.labelBold}>Código Universitario:</Text> {codigoUniversitario}</Text>
    <Text style={styles.textItem}><Text style={styles.labelBold}>Entidad receptora:</Text> {nombreInstitucion}</Text>
    <Text style={styles.textItem}><Text style={styles.labelBold}>Responsable Institucional:</Text> {nombreResponsable}</Text>
    <Text style={styles.textItem}><Text style={styles.labelBold}>Periodo de servicio:</Text> {periodoEstimado}</Text>
  </View>

  <Text style={styles.footer}>HUÁNUCO - PERÚ{"\n"}2025</Text>
</Page>

   <Page style={{ ...styles.page, textAlign: 'left' }}>
  <View style={styles.section}>
    <Text style={styles.header}>II. ANTECEDENTES</Text>
    <Text>{antecedentes}</Text>
  </View>

  <View style={styles.section}>
  <Text style={styles.header}>III. OBJETIVOS</Text>
  
  <Text style={styles.subHeaderIndented}>3.1 OBJETIVO GENERAL:</Text>
  <Text style={styles.value}>{objetivoGeneralInforme}</Text>

  <Text style={styles.subHeaderIndented}>3.2 OBJETIVOS ESPECÍFICOS:</Text>
  <Text style={styles.value}>{objetivosEspecificosInforme}</Text>
</View>

</Page>

{/* TERCERA PÁGINA - SOLO CRONOGRAMA */}
<Page style={{ ...styles.page, textAlign: 'left' }} orientation="landscape">

  <View style={styles.section}>
    <Text style={styles.header}>IV. CRONOGRAMA DE ACTIVIDADES</Text>

    <View style={styles.tableContainer}>
      {/* Fila de encabezado */}
      <View style={styles.tableRow}>
        <Text style={[styles.tableColHeader, styles.colActividad]}>Actividad</Text>
        <Text style={[styles.tableColHeader, styles.colJustificacion]}>Justificación</Text>
        <Text style={[styles.tableColHeader, styles.colFecha]}>Fecha</Text>
        <Text style={[styles.tableColHeader, styles.colFechaFin]}>Fecha Fin</Text>
        <Text style={[styles.tableColHeader, styles.colResultados]}>Resultados Esperados</Text>
      </View>

      {/* Filas de datos */}
      {actividadesSeguimiento.map((a, i) => (
        <View style={styles.tableRow} key={i}>
          <Text style={[styles.tableCol, styles.colActividad]}>{a.actividad}</Text>
          <Text style={[styles.tableCol, styles.colJustificacion]}>{a.justificacion}</Text>
          <Text style={[styles.tableCol, styles.colFecha]}>{a.fecha}</Text>
          <Text style={[styles.tableCol, styles.colFechaFin]}>{a.fecha_fin || '—'}</Text>
          <Text style={[styles.tableCol, styles.colResultados]}>{a.resultados}</Text>
        </View>
      ))}
    </View>
  </View>
</Page>

{/* CUARTA PÁGINA - Continuación */}
<Page style={{ ...styles.page, textAlign: 'left' }}>
  <View style={styles.section}>
    <Text style={styles.header}>V. ÁREA DE INFLUENCIA</Text>
    <Text>{areaInfluenciaInforme}</Text>
  </View>

  <View style={styles.section}>
    <Text style={styles.header}>VI. RECURSOS UTILIZADOS</Text>
    <Text>{recursosUtilizadosInforme}</Text>
  </View>

  <View style={styles.section}>
    <Text style={styles.header}>VII. METODOLOGÍA</Text>
    <Text>{metodologiaInforme}</Text>
  </View>

  <View style={styles.section}>
    <Text style={styles.header}>VIII. CONCLUSIONES</Text>
    <Text>{conclusionesInforme}</Text>
  </View>

  <View style={styles.section}>
    <Text style={styles.header}>IX. RECOMENDACIONES</Text>
    <Text>{recomendacionesInforme}</Text>
  </View>
</Page>

{/* QUINTA PÁGINA - Página con solo "ANEXOS" */}
<Page style={styles.anexosPage}>
  <Text style={styles.anexosTitle}>ANEXOS</Text>
</Page>
  </Document>
);

export default InformeFinalPDF;
