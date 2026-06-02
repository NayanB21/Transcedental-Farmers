
import React, { useState } from "react";

export default function LocationSearch({ onLocationFound }) {

  const [query, setQuery] = useState("");

  const searchLocation = async () => {

    if (!query.trim()) return;

    try {

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (data.length === 0) {
        alert("Location not found.");
        return;
      }

      const result = data[0];

      onLocationFound({
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      });

    } catch (err) {
      console.error(err);
      alert("Error searching location.");
    }
  };

  return (
    <div className="card">

      <h2>Search Village / Location</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Mohanpur, Paschim Medinipur"
          style={{ flex: 1 }}
        />

        
        <button className="primary" onClick={searchLocation}>Seach</button>
      

      </div>

    </div>
  );
}