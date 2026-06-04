import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
  const centerLat = patientLat ?? 20.5937;
  const centerLng = patientLng ?? 78.9629;

  const hasPatient =
    patientLat !== null &&
    patientLat !== undefined &&
    patientLng !== null &&
    patientLng !== undefined;

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
        height: "450px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {hasPatient && (
        <Marker
          position={[
            patientLat,
            patientLng,
          ]}
        >
          <Popup>
            🚨 Patient Location
          </Popup>
        </Marker>
      )}

      {hasAmbulance && (
        <Marker
          position={[
            ambulanceLat,
            ambulanceLng,
          ]}
        >
          <Popup>
            🚑 Ambulance Location
          </Popup>
        </Marker>
      )}

      {hasPatient &&
        hasAmbulance && (
          <Polyline
            positions={[
              [
                ambulanceLat,
                ambulanceLng,
              ],
              [
                patientLat,
                patientLng,
              ],
            ]}
          />
        )}
    </MapContainer>
  );
}