
import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  logo: {
    width: 60,
    height: 60,
  },
  textoCentro: {
    textAlign: 'center',
    marginBottom: 10,
  },
  firma: {
    marginTop: 50,
    textAlign: 'left',
  },
});

const CartaTerminoPDF = ({ estudiante, programa, facultad, labor, fecha, firmaBase64 }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.encabezado}>
        <Image style={styles.logo} src="/images/logonuevo.png" />
        <View>
          <Text>FACULTAD DE: {facultad || '--------'}</Text>
          <Text>PROGRAMA ACADÉMICO: {programa || '--------'}</Text>
        </View>
      </View>

      <Text style={styles.textoCentro}>Huánuco, {fecha}</Text>
      <Text style={styles.textoCentro}>CARTA DE TÉRMINO DEL SERVICIO SOCIAL</Text>

      <Text style={{ marginBottom: 10 }}>De mi consideración:</Text>
      <Text style={{ marginBottom: 10 }}>
        Reciba un cordial saludo. Por medio de la presente se deja constancia que el estudiante <Text style={{ fontWeight: 'bold' }}>{estudiante}</Text>,
        del programa académico de <Text style={{ fontWeight: 'bold' }}>{programa}</Text>, perteneciente a la facultad de <Text style={{ fontWeight: 'bold' }}>{facultad}</Text>,
        ha culminado satisfactoriamente su servicio social denominado <Text style={{ fontWeight: 'bold' }}>{labor}</Text>.
      </Text>

      <Text style={{ marginBottom: 10 }}>
        Se extiende la presente a solicitud del interesado(a), para los fines que estime convenientes.
      </Text>

      <Text style={{ marginBottom: 10 }}>
        Sin otro particular, me despido con las muestras de mi especial consideración y estima.
      </Text>

      <View style={styles.firma}>
        <Text>Atentamente,</Text>
        {firmaBase64 && <Image style={{ width: 100, marginTop: 10 }} src={firmaBase64} />}
        <Text style={{ marginTop: 5 }}>{'________________________'}</Text>
        <Text>{localStorage.getItem('nombre_usuario') || 'Docente responsable'}</Text>
      </View>
    </Page>
  </Document>
);

export default CartaTerminoPDF;
