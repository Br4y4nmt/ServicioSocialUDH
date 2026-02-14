import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const formatearFechaLarga = (fecha) => {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const diaSemana = dias[fecha.getDay()];
  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()];
  const año = fecha.getFullYear();

  return `Huánuco, ${diaSemana} ${dia} de ${mes} del ${año}`;
};

const styles = StyleSheet.create({
  page: {
    position: 'relative',
    paddingTop: 55,
    paddingBottom: 55,
    paddingLeft: 55,
    paddingRight: 55,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  borderOuter: {
    position: 'absolute',
    top: 18,
    left: 18,
    right: 18,
    bottom: 18,
    borderWidth: 2.2,
    borderColor: '#1f4e79',
  },
  borderInner: {
    position: 'absolute',
    top: 28,
    left: 28,
    right: 28,
    bottom: 28,
    borderWidth: 1,
    borderColor: '#1f4e79',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 250,
    height: 100,
    marginBottom: 6,
    objectFit: 'contain',
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

  constanciaTitle: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 6,
    marginBottom: 10,
  },

  otorgadoA: {
    fontSize: 14,
    fontFamily: 'Times-Roman',
    textAlign: 'center',
    marginBottom: 6,
  },

  studentName: {
    fontSize: 18,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  paragraphCenter: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 1.4,
    fontFamily: 'Times-Roman',
    width: '92%',
    marginBottom: 10,
  },

  paragraphLeft: {
    fontSize: 12,
    textAlign: 'left',
    fontFamily: 'Times-Roman',
    width: '92%',
    marginBottom: 12,
  },

  dateRight: {
    width: '92%',
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'Times-Roman',
    marginTop: 0,
  },

  firmaContainer: {
    marginTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  firmaImage: {
    width: 200,
    height: 80,
    objectFit: 'contain',
  },

  qrContainer: {
    position: 'absolute',
    bottom: 40,
    left: 55,
    flexDirection: 'row',
    alignItems: 'center',
    width: '55%',
  },
  qrImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    objectFit: 'contain',
  },
  qrText: {
    fontSize: 8,
    fontFamily: 'Times-Roman',
    flexShrink: 1,
    maxWidth: '75%',
    lineHeight: 1.2,
  },

  section: {
    marginTop: 10,
    width: '100%',
  },
});

const InformefinalProgramaPDF = ({ informe, qrImage, verificationUrl }) => {
  const nombre = (informe?.Estudiante?.nombre_estudiante || 'N/A').toUpperCase();
  const programa = (informe?.ProgramasAcademico?.nombre_programa || 'N/A').toUpperCase();
  const fechaFormateada = formatearFechaLarga(new Date());

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.borderOuter} fixed />
        <View style={styles.borderInner} fixed />

        <View style={styles.logoContainer}>
          <Image src="/images/logoSS.png" style={styles.logo} />
        </View>

        <Text style={styles.title}>Oficina Servicio Social Universitario</Text>
        <View style={styles.separator} />

        <Text style={styles.constanciaTitle}>
          CONSTANCIA DE CONCLUSIÓN DEL SERVICIO SOCIAL UNIVERSITARIO
        </Text>

        <Text style={styles.otorgadoA}>Otorgado a:</Text>

        <Text style={styles.studentName}>{nombre}</Text>

        <Text style={styles.paragraphCenter}>
          del Programa Académico{' '}
          <Text style={{ fontFamily: 'Times-Bold' }}>{programa}</Text>, de la Universidad de Huánuco, por haber
          acreditado un total de 96 horas efectivas de Servicio Social Universitario.
        </Text>

        <Text style={styles.paragraphLeft}>
          Se expide la presente constancia para los fines que correspondan.
        </Text>

        <Text style={styles.dateRight}>{fechaFormateada}</Text>

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

        <View style={styles.section} />
      </Page>
    </Document>
  );
};

export default InformefinalProgramaPDF;
