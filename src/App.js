import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import ExportPDFButton from "./components/ExportPDFButton";
import "./App.css";

// Icono personalizado para los marcadores
const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -30],
});

// Datos por aeropuerto
const aeropuertos = {
  Ezeiza: {
    nombre: "Ezeiza (EZE)",
    centro: [-34.822, -58.535],
    fallas: [
      {
        tipo: "Fisura longitudinal",
        lat: -34.8215,
        lon: -58.537,
        fecha: "2025-07-31T10:15:00Z",
        descripcion: "Fisura de 2 metros a lo largo de la pista principal.",
      },
      {
        tipo: "Bache superficial",
        lat: -34.819,
        lon: -58.535,
        fecha: "2025-07-30T14:00:00Z",
        descripcion: "Desgaste en la intersección de rodaje con pista secundaria.",
      },
      {
        tipo: "Objeto suelto",
        lat: -34.823,
        lon: -58.5385,
        fecha: "2025-07-29T08:45:00Z",
        descripcion: "Objeto metálico detectado en cabecera 11.",
      },
    ],
    gravedad: "Media",
    ultimaInspeccion: "31/07/2025",
    tiempoPromedio: "6 hs",
  },
  Aeroparque: {
    nombre: "Aeroparque (AEP)",
    centro: [-34.5595, -58.4156],
    fallas: [
      {
        tipo: "Grieta transversal",
        lat: -34.5602,
        lon: -58.416,
        fecha: "2025-07-29T09:00:00Z",
        descripcion: "Grieta cerca del umbral de pista.",
      },
      {
        tipo: "Desprendimiento de pavimento",
        lat: -34.5588,
        lon: -58.414,
        fecha: "2025-07-28T13:00:00Z",
        descripcion: "Desprendimiento de superficie en zona de rodaje.",
      },
    ],
    gravedad: "Alta",
    ultimaInspeccion: "30/07/2025",
    tiempoPromedio: "12 hs",
  },
  Córdoba: {
    nombre: "Córdoba (COR)",
    centro: [-31.322, -64.207],
    fallas: [
      {
        tipo: "Hundimiento leve",
        lat: -31.3215,
        lon: -64.2065,
        fecha: "2025-07-30T16:20:00Z",
        descripcion: "Hundimiento detectado por inspección visual.",
      },
    ],
    gravedad: "Baja",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "3 hs",
  },
  Bariloche: {
    nombre: "Bariloche (BRC)",
    centro: [-41.1512, -71.1575],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Catamarca: {
    nombre: "Catamarca (CTC)",
    centro: [-28.5954, -65.7514],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Comodoro_Rivadavia: {
    nombre: "Comodoro Rivadavia (CRD)",
    centro: [-45.7853, -67.4656],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  El_Palomar: {
    nombre: "El Palomar (EPA)",
    centro: [-34.6103, -58.6124],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Esquel: {
    nombre: "Esquel (EQS)",
    centro: [-42.9086, -71.1394],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Formosa: {
    nombre: "Formosa (FMA)",
    centro: [-26.2129, -58.2281],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  General_Pico: {
    nombre: "General Pico (GPO)",
    centro: [-35.6581, -63.7568],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Iguazu: {
    nombre: "Iguazú (IGR)",
    centro: [-25.7372, -54.4734],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Jujuy: {
    nombre: "Jujuy (JUJ)",
    centro: [-24.3926, -65.0978],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  La_Rioja: {
    nombre: "La Rioja (IRJ)",
    centro: [-29.3819, -66.7952],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Malargue: {
    nombre: "Malargüe (LGS)",
    centro: [-35.4847, -69.5856],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Mar_Del_Plata: {
    nombre: "Mar del Plata (MDQ)",
    centro: [-37.9342, -57.5733],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Mendoza: {
    nombre: "Mendoza (MDZ)",
    centro: [-32.8312, -68.7929],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Parana: {
    nombre: "Paraná (PRA)",
    centro: [-31.7944, -60.4807],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Posadas: {
    nombre: "Posadas (PSS)",
    centro: [-27.3858, -55.9707],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Puerto_Madryn: {
    nombre: "Puerto Madryn (PMY)",
    centro: [-42.7592, -65.1026],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Reconquista: {
    nombre: "Reconquista (RCQ)",
    centro: [-29.2106, -59.6820],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Resistencia: {
    nombre: "Resistencia (RES)",
    centro: [-27.4496, -59.0561],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Rio_Cuarto: {
    nombre: "Río Cuarto (RCU)",
    centro: [-33.0859, -64.2615],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Rio_Gallegos: {
    nombre: "Río Gallegos (RGL)",
    centro: [-51.6089, -69.3126],
    fallas: [],
    gravedad: "Ninguna",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Rio_Grande: {
    nombre: "Río Grande (RGA)",
    centro: [-53.7775, -67.7494],
    fallas: [],
    gravedad: "Sin fallas",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Rio_Hondo: {
    nombre: "Río Hondo (RHD)",
    centro: [-27.4964, -64.935],
    fallas: [],
    gravedad: "Sin fallas",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Salta: {
    nombre: "Salta (SLA)",
    centro: [-24.855, -65.4861],
    fallas: [],
    gravedad: "Sin fallas",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  San_Fernando: {
    nombre: "San Fernando (FDO)",
    centro: [-34.4523, -58.5896],
    fallas: [],
    gravedad: "Sin fallas",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  San_Juan: {
    nombre: "San Juan (UAQ)",
    centro: [-31.5715, -68.4182],
    fallas: [],
    gravedad: "Sin fallas",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  San_Luis: {
    nombre: "San Luis (LUQ)",
    centro: [-33.2732, -66.3564],
    fallas: [],
    gravedad: "Sin fallas",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  San_Rafael: {
    nombre: "San Rafael (AFA)",
    centro: [-34.5883, -68.4039],
    fallas: [],
    gravedad: "Sin fallas",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Santa_Rosa: {
    nombre: "Santa Rosa (RSA)",
    centro: [-36.5883, -64.2758],
    fallas: [],
    gravedad: "Sin fallas",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Sgo_Estero: {
    nombre: "Sgo. del Estero (SDE)",
    centro: [-27.7656, -64.3092],
    fallas: [],
    gravedad: "Sin fallas",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Tucuman: {
    nombre: "Tucuman (TUC)",
    centro: [-26.8409, -65.1049],
    fallas: [],
    gravedad: "Sin fallas",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Viedma: {
    nombre: "Viedma (VDM)",
    centro: [-40.8666, -63.0004],
    fallas: [],
    gravedad: "Sin fallas",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  },
  Villa_Mercedes: {
    nombre: "Villa Mercedes (VME)",
    centro: [-33.7499, -65.3874],
    fallas: [],
    gravedad: "Sin fallas",
    ultimaInspeccion: "01/08/2025",
    tiempoPromedio: "0 hs",
  }
};

// Componente para mover el mapa
function MapMover({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

export default function App() {
  const [selectedAirport, setSelectedAirport] = useState("Ezeiza");

  const airportData = aeropuertos[selectedAirport];

  const handleAirportChange = (event) => {
    setSelectedAirport(event.target.value);
  };

  return (
    <div>
      <header>
        <h1>Dashboard de Inspección de Pistas</h1>
        <p>Monitoreo en tiempo real - {airportData.nombre}</p>
      </header>

      <div className="container">
        <div className="dropdown-container">
          <label htmlFor="aeropuerto" style={{ marginRight: '1rem', fontWeight: 600 }}>Seleccionar Aeropuerto:</label>
          <select id="airport-select" value={selectedAirport} onChange={handleAirportChange}>
            {Object.keys(aeropuertos).map((key) => (
              <option key={key} value={key}>{aeropuertos[key].nombre}</option>
            ))}
          </select>
        </div>

        <div className="dashboard">
          <div className="card">
            <h3>Fallas Detectadas</h3>
            <p>{airportData.fallas.length}</p>
          </div>
          <div className="card">
            <h3>Gravedad Promedio</h3>
            <p>{airportData.gravedad}</p>
          </div>
          <div className="card">
            <h3>Última Inspección</h3>
            <p>{airportData.ultimaInspeccion}</p>
          </div>
          <div className="card">
            <h3>Tiempo Promedio de Reparación</h3>
            <p>{airportData.tiempoPromedio}</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <ExportPDFButton airportData={airportData} />
        </div>

        <h2 className="map-title">Mapa de Fallas en {airportData.nombre}</h2>
        <div className="map-container">
          <MapContainer center={airportData.centro} zoom={15} style={{ height: "100%", width: "100%" }}>
            <MapMover center={airportData.centro} />
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {airportData.fallas.map((falla, index) => (
              <Marker key={index} position={[falla.lat, falla.lon]} icon={icon}>
                <Popup>
                  <div>
                    <p><strong>Tipo:</strong> {falla.tipo}</p>
                    <p><strong>Fecha:</strong> {new Date(falla.fecha).toLocaleString()}</p>
                    <p><strong>Descripción:</strong> {falla.descripcion}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
