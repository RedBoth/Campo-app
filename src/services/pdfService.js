import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Genera y descarga un PDF con el historial del lote.
 * @param {object} lote - El objeto del lote con su array 'info'.
 * @param {string} nombreCampo - El nombre del campo al que pertenece (opcional).
 */
export const exportarHistorialPDF = (lote, nombreCampo = "") => {
  if (!lote || !lote.info || lote.info.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  // 1. Crear instancia del documento
  const doc = new jsPDF();

  // 2. Encabezado
  // Seteamos color verde oscuro (similar a tu app)
  doc.setTextColor(20, 33, 25); 
  doc.setFontSize(18);
  doc.text("Reporte de Historial de Lote", 14, 20);

  // Subtítulos
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Campo: ${nombreCampo}`, 14, 30);
  doc.text(`Lote: ${lote.nombre}`, 14, 36);
  
  const fechaReporte = new Date().toLocaleDateString("es-AR");
  doc.text(`Fecha de emisión: ${fechaReporte}`, 14, 42);

  // 3. Preparar datos para la tabla
  // autotable espera un array de arrays: [ ["fecha", "texto"], ["fecha", "texto"] ]
  const tableData = lote.info.map((registro) => [
    registro.fecha,
    registro.texto,
  ]);

  // 4. Generar Tabla
  autoTable(doc, {
    startY: 50,
    head: [["Fecha y Hora", "Detalle del Registro"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [22, 163, 74] },
    styles: { fontSize: 10 },
    columnStyles: {
        0: { cellWidth: 50 }, 
        1: { cellWidth: "auto" } 
    }
  });

  // 5. Pie de página (Opcional: Número de páginas)
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(10);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // 6. Descargar
  // Sanitizamos el nombre para que no tenga espacios raros
  const cleanName = lote.nombre.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`historial_${cleanName}_${fechaReporte.replace(/\//g, '-')}.pdf`);
};