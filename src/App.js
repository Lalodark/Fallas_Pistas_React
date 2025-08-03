import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";

// Icono personalizado para los marcadores
const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -30],
});

const fallasHardcodeadas = [
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
];

export default function App() {
  const [fallas] = useState(fallasHardcodeadas);
  const [selectedAirport, setSelectedAirport] = useState("Ezeiza");

  const handleAirportChange = (event) => {
    setSelectedAirport(event.target.value);
  };

  return (
    <div>
      <header>
        <h1>Dashboard de Inspección de Pistas</h1>
        <p>Monitoreo en tiempo real - Aeropuerto Internacional de Ezeiza</p>
      </header>

      <div className="container">
        <div className="dropdown-container">
          <label htmlFor="aeropuerto" style={{ marginRight: '1rem', fontWeight: 600 }}>Seleccionar Aeropuerto:</label>
          <select
            id="airport-select"
            value={selectedAirport}
            onChange={handleAirportChange}
          >
            <option value="Ezeiza">Ezeiza (EZE)</option>
            <option value="Aeroparque">Aeroparque (AEP)</option>
            <option value="Córdoba">Córdoba (COR)</option>
          </select>
        </div>

        <div className="dashboard">
          <div className="card">
            <h3>Fallas Detectadas</h3>
            <p>{fallas.length}</p>
          </div>
          <div className="card">
            <h3>Gravedad Promedio</h3>
            <p>Media</p>
          </div>
          <div className="card">
            <h3>Última Inspección</h3>
            <p>31/07/2025</p>
          </div>
          <div className="card">
            <h3>Tiempo Promedio de Reparación</h3>
            <p>6 hs</p>
          </div>
        </div>

        <h2 className="map-title">Mapa de Fallas en Ezeiza</h2>
        <div className="map-container">
          <MapContainer center={[-34.822, -58.535]} zoom={15} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {fallas.map((falla, index) => (
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
