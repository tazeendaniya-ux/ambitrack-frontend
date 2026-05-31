import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue (VERY IMPORTANT)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView({
  patientLat,
  patientLng,
  ambulanceLat,
  ambulanceLng,
}) {
  // 🛡️ fallback (prevents map crash)
  const centerLat = patientLat || 20.5937; // India center fallback
  const centerLng = patientLng || 78.9629;

  const hasAmbulance =
    ambulanceLat !== null &&
    ambulanceLat !== undefined &&
    ambulanceLng !== null &&
    ambulanceLng !== undefined;

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={13}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Map tiles */}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🚨 Patient Marker */}
      {patientLat && patientLng && (
        <Marker position={[patientLat, patientLng]}>
          <Popup>🚨 Patient Location</Popup>
        </Marker>
      )}

      {/* 🚑 Ambulance Marker (LIVE READY) */}
      {hasAmbulance && (
        <Marker position={[ambulanceLat, ambulanceLng]}>
          <Popup>🚑 Ambulance Location (Live)</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}