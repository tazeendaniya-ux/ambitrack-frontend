import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 🚀 AUTO-FIT MAP TO BOTH MARKERS
function RecenterMap({
  patientLat,
  patientLng,
  ambulanceLat,
  ambulanceLng,
}) {
  const map = useMap();

  useEffect(() => {
    if (
      patientLat == null ||
      patientLng == null ||
      ambulanceLat == null ||
      ambulanceLng == null
    ) {
      return;
    }

    const bounds = [
      [patientLat, patientLng],
      [ambulanceLat, ambulanceLng],
    ];

    map.fitBounds(bounds, {
      padding: [60, 60],
    });
  }, [
    patientLat,
    patientLng,
    ambulanceLat,
    ambulanceLng,
    map,
  ]);

  return null;
}

export default function MapView({
  patientLat,
  patientLng,
  ambulanceLat,
  ambulanceLng,
}) {
  const hasPatient =
    patientLat != null &&
    patientLng != null;

  const hasAmbulance =
    ambulanceLat != null &&
    ambulanceLng != null;

  const centerLat =
    patientLat ?? 20.5937;
  const centerLng =
    patientLng ?? 78.9629;

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={13}
      style={{
        height: "450px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🚀 AUTO ZOOM CONTROLLER */}
      <RecenterMap
        patientLat={patientLat}
        patientLng={patientLng}
        ambulanceLat={ambulanceLat}
        ambulanceLng={ambulanceLng}
      />

      {/* 🚨 PATIENT MARKER */}
      {hasPatient && (
        <Marker position={[patientLat, patientLng]}>
          <Popup>🚨 Patient Location</Popup>
        </Marker>
      )}

      {/* 🚑 AMBULANCE MARKER */}
      {hasAmbulance && (
        <Marker position={[ambulanceLat, ambulanceLng]}>
          <Popup>🚑 Ambulance Location</Popup>
        </Marker>
      )}

      {/* 🛣️ ROUTE LINE */}
      {hasPatient && hasAmbulance && (
        <Polyline
          positions={[
            [ambulanceLat, ambulanceLng],
            [patientLat, patientLng],
          ]}
        />
      )}
    </MapContainer>
  );
}