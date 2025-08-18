import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./ExportPDFButton.css";
import { ReactComponent as PdfIcon } from "./pdf-icon.svg"; // SVG vector importado

const ExportPDFButton = ({ airportData }) => {
  const exportToPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // === TÍTULO DEL REPORTE ===
    doc.setFontSize(18);
    doc.text("Reporte de Fallas - " + airportData.nombre, 14, 20);

    // === INFO DEL AEROPUERTO ===
    doc.setFontSize(12);
    doc.text(`Ubicación: ${airportData.centro[0]}, ${airportData.centro[1]}`, 14, 30);
    doc.text(`Cantidad de fallas detectadas: ${airportData.fallas.length}`, 14, 38);
    doc.text(`Fecha del reporte: ${new Date().toLocaleString()}`, 14, 46);

    // === ESQUEMA DE PISTA VERTICAL ===
    const pistaX = 90;     // posición horizontal de la pista
    const pistaY = 60;     // inicio vertical
    const pistaWidth = 30; // ancho
    const pistaHeight = 120; // alto

    // Rectángulo de la pista
    doc.setFillColor(50, 50, 50);
    doc.rect(pistaX, pistaY, pistaWidth, pistaHeight, "F");

    // Línea central discontinua
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(1);
    const dashCount = 10;
    const dashLength = pistaHeight / (dashCount * 2);
    for (let i = 0; i < dashCount; i++) {
      const y1 = pistaY + i * 2 * dashLength;
      const y2 = y1 + dashLength;
      doc.line(pistaX + pistaWidth / 2, y1, pistaX + pistaWidth / 2, y2);
    }

    // === FALLAS ===
    const fallas = airportData.fallas;
    const fallasCount = fallas.length;

    let posicionesY = [];
    const centerY = pistaY + pistaHeight / 2;

    if (fallasCount === 1) {
      posicionesY = [centerY];
    } else if (fallasCount === 2) {
      posicionesY = [pistaY + 30, pistaY + pistaHeight - 30];
    } else if (fallasCount >= 3) {
      posicionesY = [pistaY + 30, centerY, pistaY + pistaHeight - 30];
    }

    // Dibujar círculos de fallas (con desplazamiento lateral)
    fallas.slice(0, 3).forEach((f, index) => {
      // Posición base (centro de la pista)
      let posX = pistaX + pistaWidth / 2;
      const posY = posicionesY[index];

      // Alternar desplazamiento lateral
      const offset = 6; // cuánto se mueve a los lados
      if (index % 2 === 0) {
        posX -= offset; // izquierda
      } else {
        posX += offset; // derecha
      }

      // círculo rojo más chico
      doc.setFillColor(255, 0, 0);
      doc.circle(posX, posY, 4, "F");

      // número dentro
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text(String(index + 1), posX - 2.5, posY + 3);
      doc.setTextColor(0, 0, 0);
});

    // === LEYENDA DE FALLAS ===
    let leyendaY = pistaY + pistaHeight + 15;
    // doc.setFontSize(12);
    // doc.text("Leyenda de Fallas:", 14, leyendaY);
    // leyendaY += 6;

    // fallas.forEach((f, index) => {
    //   doc.text(`${index + 1}. ${f.tipo} (${f.prioridad})`, 20, leyendaY);
    //   leyendaY += 6;
    // });

    // === TABLA DE FALLAS ===
    const rows = fallas.map((f, index) => [
      index + 1,
      f.tipo,
      new Date(f.fecha).toLocaleString(),
      `${f.lat.toFixed(4)}, ${f.lon.toFixed(4)}`
    ]);

    autoTable(doc, {
      head: [["#", "Tipo", "Fecha", "Ubicación"]],
      body: rows,
      startY: leyendaY + 5,
    });

    // Exportar PDF
    doc.save(`Reporte - ${airportData.nombre}.pdf`);
  };

  return (
    <button className="export-button" onClick={exportToPDF}>
      <PdfIcon className="icon" />
      Exportar PDF
    </button>
  );
};

export default ExportPDFButton;
