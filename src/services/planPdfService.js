import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFDocument } from "pdf-lib";
import Swal from "sweetalert2";
import { alertWarning } from "../hooks/alerts/alertas";


export async function generarPlanServicioSocialPDF({
  imagenesAnexos,
  actividades,
  nombreInstitucion,
  nombreResponsable,
  lineaAccion,
  fechaPresentacion,
  periodoEstimado,
  introduccion,
  justificacion,
  objetivoGeneral,
  objetivosEspecificos,
  nombreEntidad,
  misionVision,
  areasIntervencion,
  ubicacionPoblacion,
  areaInfluencia,
  metodologiaIntervencion,
  recursosRequeridos,
  resultadosEsperados,
  nombreFacultad,
  nombrePrograma,
  nombreLaborSocial,
  nombreCompleto,
  codigoUniversitario,
}) {
  const camposRequeridos = [
    nombreInstitucion,
    nombreResponsable,
    lineaAccion,
    fechaPresentacion,
    periodoEstimado,
    introduccion,
    justificacion,
    objetivoGeneral,
    objetivosEspecificos,
    nombreEntidad,
    misionVision,
    areasIntervencion,
    ubicacionPoblacion,
    areaInfluencia,
    metodologiaIntervencion,
    recursosRequeridos,
    resultadosEsperados,
  ];

  if (!imagenesAnexos?.cartaAceptacion) {
    await alertWarning('Falta el ANEXO', 'Debes adjuntar el convenio de Cooperación Institucional antes de generar el PDF.');
    return null;
  }

  const camposVacios =
    camposRequeridos.some((campo) => String(campo || "").trim() === "") ||
    !Array.isArray(actividades) ||
    actividades.length === 0;

  if (camposVacios) {
    await alertWarning('Campos incompletos', 'Completa todos los campos del esquema plan y agrega al menos una actividad antes de generar el PDF.');
    return null;
  }

  const periodoEnDias = {
    "4 MESES": 120,
    "5 MESES": 150,
    "6 MESES": 180,
  };

  const diasRequeridos = periodoEnDias[String(periodoEstimado || "").toUpperCase()];
  const sumaDiasActividades = actividades.reduce((total, act) => {
    const fechaInicio = new Date(act.fecha);
    const fechaFin = new Date(act.fechaFin);
    const diffEnMs = fechaFin - fechaInicio;
    const diffDias = diffEnMs / (1000 * 60 * 60 * 24);
    return total + (diffDias > 0 ? diffDias : 0);
  }, 0);

  if (diasRequeridos && sumaDiasActividades < diasRequeridos) {
    await alertWarning(
      'Duración insuficiente',
      `La suma total de tus actividades es de ${Math.floor(sumaDiasActividades)} días, pero el periodo estimado es de ${diasRequeridos} días.`
    );
    return null;
  }

  const actividadesOrdenadas = [...actividades].sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha)
  );

  for (let i = 1; i < actividadesOrdenadas.length; i++) {
    const anteriorFin = new Date(actividadesOrdenadas[i - 1].fechaFin);
    const actualInicio = new Date(actividadesOrdenadas[i].fecha);

    if (actualInicio < anteriorFin) {
      await Swal.fire({
        icon: "warning",
        title: "Fechas traslapadas",
        text: `La actividad "${actividadesOrdenadas[i].actividad}" comienza antes de que termine la actividad anterior.`,
        confirmButtonText: "Corregir",
      });
      return null;
    }
  }

  const doc = new jsPDF();
  const altoPagina = doc.internal.pageSize.getHeight();

  doc.setFont("times");
  doc.setFontSize(12);
  doc.text("UNIVERSIDAD DE HUÁNUCO", 105, 20, { align: "center" });

  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text(`FACULTAD DE ${String(nombreFacultad || "").toUpperCase()}`, 105, 30, {
    align: "center",
  });

  doc.setFont("times", "bold");
  doc.setFontSize(14);

  const textoPrograma = `PROGRAMA ACADÉMICO DE ${String(nombrePrograma || "").toUpperCase()}`;
  const lineasProg = doc.splitTextToSize(textoPrograma, 160);

  if (lineasProg.length === 1) {
    doc.text(lineasProg[0], 105, 40, { align: "center" });
  } else {
    doc.text(lineasProg[0], 105, 40, { align: "center" });
    doc.text(lineasProg[1], 105, 47, { align: "center" });
  }

  const logo = await fetch("/images/logonuevo.png")
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        })
    );

  doc.addImage(logo, "PNG", 56, 50, 90, 60);

  doc.setFontSize(16);
  doc.text("PLAN SERVICIO SOCIAL UDH", 105, 120, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(30, 125, 180, 125);

  doc.setFontSize(14);
  doc.setFont("times", "bolditalic");
  doc.text(`"${nombreLaborSocial || ""}"`, 105, 132, { align: "center" });
  doc.line(30, 137, 180, 137);

  doc.setFontSize(12);

  const yInicial = 155;
  const saltoLinea = 10;
  let yActual = yInicial;

  const escribirCampo = (label, valor, y) => {
    doc.setFont("times", "bold");
    doc.text(label, 25, y);
    doc.setFont("times", "normal");
    doc.text(String(valor ?? ""), 80, y);
  };

  escribirCampo("Nombre Completo:", nombreCompleto, yActual);
  yActual += saltoLinea;

  escribirCampo("Código Universitario:", codigoUniversitario, yActual);
  yActual += saltoLinea;

  escribirCampo("Nombre de la Institución:", nombreInstitucion, yActual);
  yActual += saltoLinea;

  escribirCampo("Responsable Institucional:", nombreResponsable, yActual);
  yActual += saltoLinea;

  escribirCampo("Línea de Acción:", lineaAccion, yActual);
  yActual += saltoLinea;

  escribirCampo("Fecha de Presentación:", fechaPresentacion, yActual);
  yActual += saltoLinea;

  escribirCampo("Periodo Estimado:", periodoEstimado, yActual);

  doc.setFontSize(12);
  doc.text("HUÁNUCO - PERÚ", 105, 270, { align: "center" });
  doc.text("2025", 105, 278, { align: "center" });

  doc.addPage();
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  const tituloIntro = "INTRODUCCIÓN";
  const anchoTitulo = doc.getTextWidth(tituloIntro);
  const yTitulo = 60;
  doc.text(tituloIntro, (doc.internal.pageSize.getWidth() - anchoTitulo) / 2, yTitulo);

  doc.setFont("times", "normal");
  doc.setFontSize(12);
  const introLineas = doc.splitTextToSize(introduccion, 170);
  doc.text(introLineas, 30, yTitulo + 20);

  doc.addPage();
  let y = 20;
  const margenInferior = 20;

  doc.setFontSize(12);
  doc.setFont("times", "bold");
  doc.text("1. JUSTIFICACIÓN", 20, y);
  doc.setFont("times", "normal");
  y += 12;
  const lineasJustificacion = doc.splitTextToSize(justificacion, 170);
  doc.text(lineasJustificacion, 20, y);
  y += lineasJustificacion.length * 6 + 4;

  doc.setFont("times", "bold");
  doc.text("2. OBJETIVOS", 20, y);
  y += 12;

  doc.setFont("times", "bold");
  doc.text("2.1 OBJETIVO GENERAL:", 25, y);
  doc.setFont("times", "normal");
  y += 6;
  const lineasObjGeneral = doc.splitTextToSize(objetivoGeneral, 170);
  doc.text(lineasObjGeneral, 25, y);
  y += lineasObjGeneral.length * 6 + 4;

  doc.setFont("times", "bold");
  doc.text("2.2 OBJETIVOS ESPECÍFICOS:", 25, y);
  doc.setFont("times", "normal");
  y += 6;
  const lineasObjEspecificos = doc.splitTextToSize(objetivosEspecificos, 170);
  const altoContenidoObj = lineasObjEspecificos.length * 6;

  if (y + altoContenidoObj > altoPagina - margenInferior) {
    doc.addPage();
    y = 20;
  }
  doc.text(lineasObjEspecificos, 25, y);
  y += altoContenidoObj + 4;

  doc.setFont("times", "bold");
  doc.text("3. MARCO INSTITUCIONAL", 20, y);
  y += 12;

  const marcoSubsecciones = [
    ["3.1 NOMBRE DE LA ENTIDAD:", nombreEntidad],
    ["3.2 MISIÓN Y VISIÓN:", misionVision],
    ["3.3 SERVICIOS:", areasIntervencion],
    ["3.4 ÁREAS DE INTERVENCIÓN O SERVICIOS QUE OFRECE:", areasIntervencion],
    ["3.5 UBICACIÓN Y POBLACIÓN:", ubicacionPoblacion],
  ];

  for (const [titulo, texto] of marcoSubsecciones) {
    doc.setFont("times", "bold");
    doc.text(titulo, 25, y);
    doc.setFont("times", "normal");
    y += 6;

    const lineasSub = doc.splitTextToSize(String(texto || ""), 170);
    const altoContenido = lineasSub.length * 6;

    if (y + altoContenido > altoPagina - margenInferior) {
      doc.addPage();
      y = 20;
    }

    doc.text(lineasSub, 25, y);
    y += altoContenido + 4;

    if (y > altoPagina - margenInferior) {
      doc.addPage();
      y = 20;
    }
  }

  doc.setFont("times", "bold");
  doc.text("4. ÁREA DE INFLUENCIA", 20, y);
  doc.setFont("times", "normal");
  y += 6;

  const lineasArea = doc.splitTextToSize(areaInfluencia, 170);
  const altoContenidoArea = lineasArea.length * 6;
  if (y + altoContenidoArea > altoPagina - margenInferior) {
    doc.addPage();
    y = 20;
  }
  doc.text(lineasArea, 20, y);
  y += altoContenidoArea + 4;

  doc.setFont("times", "bold");
  doc.text("5. METODOLOGÍA DE INTERVENCIÓN", 20, y);
  doc.setFont("times", "normal");
  y += 6;
  const lineasMetodo = doc.splitTextToSize(metodologiaIntervencion, 170);
  doc.text(lineasMetodo, 20, y);
  y += lineasMetodo.length * 6 + 4;

  doc.setFont("times", "bold");
  doc.text("6. RECURSOS REQUERIDOS", 20, y);
  doc.setFont("times", "normal");
  y += 6;
  const lineasRecursos = doc.splitTextToSize(recursosRequeridos, 170);
  const altoContenidoRecursos = lineasRecursos.length * 6;
  if (y + altoContenidoRecursos > altoPagina - margenInferior) {
    doc.addPage();
    y = 20;
  }
  doc.text(lineasRecursos, 20, y);
  y += altoContenidoRecursos + 4;

  doc.setFont("times", "bold");
  doc.text("7. RESULTADOS ESPERADOS", 20, y);
  doc.setFont("times", "normal");
  y += 6;
  const lineasResultados = doc.splitTextToSize(resultadosEsperados, 170);
  const altoContenidoResultados = lineasResultados.length * 6;
  if (y + altoContenidoResultados > altoPagina - margenInferior) {
    doc.addPage();
    y = 20;
  }
  doc.text(lineasResultados, 20, y);
  y += altoContenidoResultados + 4;

  doc.addPage("a4", "landscape");
  const anchoPagina = doc.internal.pageSize.getWidth();
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("CRONOGRAMA DE ACTIVIDADES", anchoPagina / 2, 80, { align: "center" });

  autoTable(doc, {
    startY: 90,
    margin: { left: 25, right: 25 },
    tableWidth: "wrap",
    head: [["Actividad", "Justificación", "Fecha Estimada", "Fecha Fin", "Resultados Esperados"]],
    body: actividades.map((a) => [
      a.actividad,
      a.justificacion,
      a.fecha,
      a.fechaFin || "",
      a.resultados,
    ]),
    styles: { fontSize: 11, halign: "center", valign: "middle" },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold", fontSize: 12 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    columnStyles: {
      0: { halign: "left", cellWidth: 60 },
      1: { halign: "left", cellWidth: 60 },
      2: { halign: "center", cellWidth: 32 },
      3: { halign: "center", cellWidth: 32 },
      4: { halign: "left", cellWidth: 60 },
    },
  });

  doc.addPage("a4", "portrait");
  doc.setFont("times", "bold");
  doc.setFontSize(40);
  doc.text("ANEXOS", 105, 150, { align: "center" });

  const pdfBlob = doc.output("blob");

  const anexos = [
    imagenesAnexos.cartaAceptacion,
    imagenesAnexos.datosContacto,
    imagenesAnexos.organigrama,
    imagenesAnexos.documentosAdicionales,
  ];

  const mergedBlob = await mergePDFs(pdfBlob, anexos);
  const url = URL.createObjectURL(mergedBlob);
  const file = new File([mergedBlob], "PLAN-SERVICIO-SOCIAL-UDH.pdf", { type: "application/pdf" });

  return { url, file, mergedBlob };
}

async function mergePDFs(mainPdfBlob, anexos) {
  const mainPdfBytes = await mainPdfBlob.arrayBuffer();
  const mainPdfDoc = await PDFDocument.load(mainPdfBytes);

  for (const anexo of anexos) {
    if (!anexo) continue;

    const anexoBytes = await anexo.arrayBuffer();
    const anexoDoc = await PDFDocument.load(anexoBytes);

    const copiedPages = await mainPdfDoc.copyPages(anexoDoc, anexoDoc.getPageIndices());
    copiedPages.forEach((page) => mainPdfDoc.addPage(page));
  }

  const mergedPdfBytes = await mainPdfDoc.save();
  return new Blob([mergedPdfBytes], { type: "application/pdf" });
}
