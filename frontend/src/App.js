// src/App.js
import React, { useState } from "react";

import MapSelector from "./components/MapSelector";
import CadastralForm from "./components/CadastralForm"; 
import FarmerForm from "./components/FarmerForm";
import LocationSearch from "./components/LocationSearch";
import "./App.css";

/**
 * Helper: returns an array (or single object) of WMS configs for a given state key.
 * For Madhya Pradesh we provide a candidate MP WebGIS WMS base URL (you'll fetch exact layer name next).
 * Fallback: Bhuvan (village/admin) WMS for pan-India coverage.
 * ------------this commenting was of previous logic of integrating all open street,mp bhulekh and bhuvan
 */

const bhuvanWms = {
  url:
    "https://bhuvan-vec1.nrsc.gov.in/bhuvan/gwc/service/wms?",
  layers: "basemap:WB_Vill",
  format: "image/png",
  transparent: true,
  version: "1.1.1",
  opacity: 0.8
};


export default function App() {  //default=main thing/file/fn
  const [farmer, setFarmer] = useState({ name: "", phone: "", village: "", crop: "", cropStage: "" });
  const [landRecord, setLandRecord]=useState({state:"West Bengal",district:"",tehsil:"",village:""});
  const [farmLocation, setFarmLocation] = useState(null);
  const [farmPolygon, setFarmPolygon] =useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [saved, setSaved] = useState(false);

  

  const saveToCloud = async () => {
    if (!farmer.name || !farmer.phone || !farmer.crop || !farmLocation||farmPolygon.length< 3) {
      alert("Please fill name, phone, crop and pick the location and draw polygon with atleast 3 points on the map.");
      return;
    }
    try {
      const payload = {
        farmer,
        landRecord,
        location: { lat: farmLocation.lat, lng: farmLocation.lng },
        polygon: farmPolygon,
        boundarySource: "farmer_drawn_polygon",
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "farms"), payload);
      setSaved(true);
      alert("✅ Saved to Firebase Cloud!");
    } catch (e) {
      console.error(e);
      alert("Error saving to Firebase: " + e.message);
    }
  };

  


  return (
    <div className="container">
      <h1>Transcedental Farmers • अतींद्रिय किसान</h1>
      <p style={{ marginTop: -10, color: "#555" }}>An Initiative For The Farmer By The Farmer</p>

      {/*1.FARMER FORM*/}
      <FarmerForm
        value={farmer}
        onChange={setFarmer}
        onEdit={() => setSaved(false)}
      />

      {/*2.CADASTRAL/LAND LOCATION*/}
      <CadastralForm
        value={landRecord}
        onChange={setLandRecord}
        onEdit={() => setSaved(false)}
      />

      {/*3.Location search */}
      <LocationSearch
        onLocationFound={(location) => {
          setMapCenter(location);
          setFarmLocation(location);
        }}
      />


      {/*4.MAP SELECTOR */}
      <div className="card">
        <h2>Map (Click on the map to select your farm location.)</h2>
        <MapSelector
          center={mapCenter}
          polygon={farmPolygon}
          onPolygonChange={setFarmPolygon}
          value={farmLocation}
          onChange={(location) => {
            setSaved(false);
            setFarmLocation(location);
          }}
          wms={bhuvanWms}
        />
      </div>


      {/*4.SAVE BUTTON */}
      <button className="primary" onClick={saveToCloud}>Save Registration</button>
      {saved && <div className="ok">✅ Saved to Firebase Cloud!</div>}

    </div>
  );
}
