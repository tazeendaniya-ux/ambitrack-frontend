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
import { useEffect, useState } from "react";
import polyline from "@mapbox/polyline";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ================= AUTO FIT =================
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
  const [routeCoords, setRouteCoords] =
    useState([]);

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

  // ================= FETCH ROAD ROUTE =================
  useEffect(() => {
    const fetchRoute = async () => {
      if (
        !hasPatient ||
        !hasAmbulance
      ) {
        return;
      }

      try {
        const response = await fetch(
          "https://api.openrouteservice.org/v2/directions/driving-car",
          {
            method: "POST",
            headers: {
              Authorization:
                import.meta.env
                  .VITE_ORS_API_KEY,
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              coordinates: [
                [
                  ambulanceLng,
                  ambulanceLat,
                ],
                [
                  patientLng,
                  patientLat,
                ],
              ],
            }),
          }
        );

        const data =
          await response.json();

        if (
          !data.routes ||
          !data.routes.length
        ) {
          return;
        }

        const encoded =
          data.routes[0].geometry;

        const decoded =
          polyline.decode(encoded);

        setRouteCoords(decoded);
      } catch (err) {
        console.error(
          "Route fetch error:",
          err
        );
      }
    };

    fetchRoute();
  }, [
    patientLat,
    patientLng,
    ambulanceLat,
    ambulanceLng,
    hasPatient,
    hasAmbulance,
  ]);

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

      <RecenterMap
        patientLat={patientLat}
        patientLng={patientLng}
        ambulanceLat={ambulanceLat}
        ambulanceLng={ambulanceLng}
      />

      {/* PATIENT */}
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

      {/* LIVE AMBULANCE */}
      {hasAmbulance && (
        <Marker
          position={[
            ambulanceLat,
            ambulanceLng,
          ]}
        >
          <Popup>
            🚑 Live Ambulance Location
          </Popup>
        </Marker>
      )}

      {/* ROAD ROUTE */}
      {routeCoords.length > 0 && (
        <Polyline
          positions={routeCoords}
          pathOptions={{
            color: "blue",
            weight: 5,
          }}
        />
      )}
    </MapContainer>
  );
}