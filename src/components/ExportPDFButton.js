import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "./ExportPDFButton.css";
import { ReactComponent as PdfIcon } from "./pdf-icon.svg"; // SVG vector importado

const ExportPDFButton = ({ airportData }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    console.log(airportData);
    // Título del reporte
    doc.setFontSize(18);
    doc.text("Reporte de Fallas - " + airportData.nombre, 14, 20);

    // Información del aeropuerto
    doc.setFontSize(12);
    doc.text(`Ubicación: ${airportData.centro[0]}, ${airportData.centro[1]}`, 14, 30);
    doc.text(`Cantidad de fallas detectadas: ${airportData.fallas.length}`, 14, 38);
    doc.text(`Fecha del reporte: ${new Date().toLocaleString()}`, 14, 46);

    // Tabla con fallas
    const rows = airportData.fallas.map((f, index) => [
      index + 1,
      f.tipo,
      new Date(f.fecha).toLocaleString(),
      `${f.lat}, ${f.lon}`
    ]);

    autoTable(doc, {
      head: [["#", "Tipo", "Fecha", "Ubicación"]],
      body: rows,
      startY: 55
    });

    doc.save(`Reporte - ${airportData.nombre}.pdf`);
  };

  return (
    <button className='export-button' onClick={exportToPDF}>
    <PdfIcon className="icon" />
      Exportar PDF
    </button>
  );
};

export default ExportPDFButton;
