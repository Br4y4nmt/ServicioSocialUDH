import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Formato de fecha en español
const formatearFechaLarga = (fecha) => {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  const diaSemana = dias[fecha.getDay()];
  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()];
  const año = fecha.getFullYear();

  return `Huánuco, ${diaSemana} ${dia} de ${mes} del ${año}`;
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 250,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: 'Times-Roman',
  },
  separator: {
    width: '100%',
    borderBottom: '1 solid black',
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Times-Roman',
  },
  subsubtitle: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 20,
    fontFamily: 'Times-Roman',
  },
  paragraph: {
    fontSize: 12,
    textAlign: 'justify',
    marginBottom: 10,
    lineHeight: 1.5,
    fontFamily: 'Times-Roman',
    paddingHorizontal: 30,
  },
  paragraphLeft: {
    fontSize: 12,
    textAlign: 'left',
    fontFamily: 'Times-Roman',
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  dateRight: {
    width: '100%',
    fontSize: 12,
    textAlign: 'right',
    paddingRight: 30,
    fontFamily: 'Times-Roman',
    marginTop: 30,
  },
  section: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 30,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
    marginBottom: 4,
  },
  firmaContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  firmaImage: {
    width: 200,
    height: 80,
  },
 qrContainer: {
  position: 'absolute',
  bottom: 30,
  left: 30,
  flexDirection: 'row',
  alignItems: 'center',
  width: '60%',
},

qrImage: {
  width: 60,        // ⬅️ antes 80
  height: 60,       // ⬅️ antes 80
  marginRight: 0,
},

qrText: {
  fontSize: 8,      // ⬅️ antes 10
  fontFamily: 'Times-Roman',
  flexShrink: 1,
  maxWidth: '75%',
  wordBreak: 'break-all',
  lineHeight: 1.2,
},

});

const InformefinalProgramaPDF = ({ informe, qrImage, verificationUrl }) => {
  const nombre = informe.Estudiante?.nombre_estudiante || 'N/A';
  const programa = informe.ProgramasAcademico?.nombre_programa || 'N/A';
  const fechaFormateada = formatearFechaLarga(new Date());

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.logoContainer}>
          <Image src="/images/logoSS.png" style={styles.logo} />
        </View>

        <Text style={styles.title}>Oficina Servicio Social Universitario</Text>
        <View style={styles.separator} />
        <Text style={styles.subtitle}>CONSTANCIA DE HABER CONCLUIDO EL SERVICIO SOCIAL UNIVERSITARIO</Text>
        <Text style={styles.subsubtitle}>Hace constar:</Text>

        <Text style={styles.paragraph}>
          Que el (la) alumno (a) {nombre} del Programa Académico {programa}, de la Universidad de Huánuco, acreditó un total de 96 horas efectivas de Servicio Social Universitario.
        </Text>

        <Text style={styles.paragraphLeft}>
          Se expide la presente constancia para los fines que correspondan.
        </Text>

        <Text style={styles.dateRight}>{fechaFormateada}</Text>

        {/* Firma */}
        <View style={styles.firmaContainer}>
          <Image src="/images/firma.jpg" style={styles.firmaImage} />
        </View>
        {qrImage && verificationUrl && (
        <View style={styles.qrContainer}>
          <Image src={qrImage} style={styles.qrImage} />
          <Text style={styles.qrText}>
            Documento: CONSTANCIA DE SERVICIO SOCIAL UNIVERSITARIO{'\n'}
            URL de Verificación:{'\n'}
            {verificationUrl}
          </Text>
        </View>
      )}
        {/* Datos internos */}
        <View style={styles.section}>
        </View>
      </Page>
    </Document>
  );
};

export default InformefinalProgramaPDF;
