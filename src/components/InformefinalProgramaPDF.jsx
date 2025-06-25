// components/InformePDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  label: { fontSize: 12, fontWeight: 'bold' },
  value: { fontSize: 12, marginBottom: 4 },
});

const InformefinalProgramaPDF = ({ informe }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.label}>Facultad:</Text>
        <Text style={styles.value}>{informe.ProgramasAcademico?.Facultade?.nombre_facultad || 'N/A'}</Text>

        <Text style={styles.label}>Programa Académico:</Text>
        <Text style={styles.value}>{informe.ProgramasAcademico?.nombre_programa || 'N/A'}</Text>

        <Text style={styles.label}>Estudiante:</Text>
        <Text style={styles.value}>{informe.Estudiante?.nombre_estudiante || 'N/A'}</Text>

        <Text style={styles.label}>Fecha de Aprobación:</Text>
        <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>

        <Text style={styles.label}>ID del Informe:</Text>
        <Text style={styles.value}>{informe.id}</Text>
      </View>
    </Page>
  </Document>
);

export default InformefinalProgramaPDF;
