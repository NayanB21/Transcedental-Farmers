// src/components/MapSelector.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, WMSTileLayer, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) { onPick(e.latlng); }
  });
  return null;
}

/* Renders WMS layers but only when zoom >= layer.minZoom (if provided) */
function WMSLayers({ wmsList }) {
  const map = useMap();
  const zoom = map.getZoom();
  return (
    <>
      {Array.isArray(wmsList) && wmsList.map((w, i) => {
        const shouldRender = (typeof w.minZoom === "number") ? zoom >= w.minZoom : true;
        if (!shouldRender) return null;
        return (
          <WMSTileLayer
            key={i}
            url={w.url}
            layers={w.layers}
            format={w.format || "image/png"}
            transparent={w.transparent ?? true}
            version={w.version || "1.3.0"}
            opacity={w.opacity ?? 0.7}
            // optional bbox or tileSize may be passed inside w if needed
          />
        );
      })}
    </>
  );
}

/**
 * MapSelector props:
 * - value: {lat,lng} or null
 * - onChange(latlng)
 * - height: string
 * - wms: either a single wms object or an array of wms objects
 */
export default function MapSelector({
  initialCenter = [22.9734, 78.6569], // India-ish center
  initialZoom = 6,
  value = null,
  onChange = () => {},
  height = "420px",
  wms = null,
}) {
  const [picked, setPicked] = useState(value);
  useEffect(() => setPicked(value), [value]);

  const handlePick = (latlng) => {
    setPicked(latlng);
    onChange(latlng);
  };

  // normalize wms to array
  const wmsList = wms ? (Array.isArray(wms) ? wms : [wms]) : [];

  return (
    <div>
      <div style={{ height, width: "100%", borderRadius: 12, overflow: "hidden" }}>
        <MapContainer
          center={picked ? [picked.lat, picked.lng] : initialCenter}
          zoom={picked ? 14 : initialZoom}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
          <WMSLayers wmsList={wmsList} />
          <ClickHandler onPick={handlePick} />
          {picked && <Marker position={[picked.lat, picked.lng]} />}
        </MapContainer>
      </div>

      <div style={{ marginTop: 10, fontSize: 14 }}>
        {picked ? (
          <div><b>Selected Location:</b> {picked.lat.toFixed(6)}, {picked.lng.toFixed(6)}</div>
        ) : (
          <i> 
        ⚠️Disclaimer: The land boundaries shown here are for reference purposes only. Official and legally valid records are available on the state Bhulekh / Bhunaksha portals and government offices.
          </i>
          
        )}
      </div>
    </div>
  );
}
