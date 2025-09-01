// src/App.js
import React, { useState } from "react";
import { db } from "./lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import MapSelector from "./components/MapSelector";
import CadastralForm from "./components/CadastralForm"; // if you added it earlier
import "./App.css";

/**
 * Helper: returns an array (or single object) of WMS configs for a given state key.
 * For Madhya Pradesh we provide a candidate MP WebGIS WMS base URL (you'll fetch exact layer name next).
 * Fallback: Bhuvan (village/admin) WMS for pan-India coverage.
 */
function getWmsForState(stateKey) {
  const bhuvan = {
    // Bhuvan public WMS (good for administrative/village boundaries nationwide)
    url: "https://bhuvan-vec1.nrsc.gov.in/bhuvan/gwc/service/wms?",
    layers: "settlement", // example: village/settlement layer — adjust after checking GetCapabilities
    format: "image/png",
    transparent: true,
    version: "1.3.0",
    minZoom: 6, // show at zoom >= 6
    opacity: 0.6,
  };

  // Candidate MP WebGIS WMS (WebGIS 2.0). -> You must discover exact layer name via GetCapabilities (instructions below)
  const mpCandidate = {
    url: "https://webgis2.mpbhulekh.gov.in/ows?", // candidate WMS base — test & find layer name
    layers: "REPLACE_WITH_LAYER_NAME_FROM_GetCapabilities", // <-- you must fill this after the discovery step
    format: "image/png",
    transparent: true,
    version: "1.3.0",
    minZoom: 12, // only show fine cadastral at high zoom
    opacity: 0.75,
  };

  switch ((stateKey || "").toLowerCase()) {
    case "madhya pradesh":
    case "mp":
    case "madhyapradesh":
      // return MP candidate first, then bhuvan as fallback
      return [mpCandidate, bhuvan];
    default:
      return [bhuvan];
  }
}

export default function App() {
  const [farmer, setFarmer] = useState({ name: "", phone: "", village: "", crop: "", cropStage: "" });
  const [landRecord, setLandRecord] = useState({ state: "Madhya Pradesh", district: "", tehsil: "", village: "", surveyNo: "" });
  const [farmLocation, setFarmLocation] = useState(null);
  const [saved, setSaved] = useState(false);

  const onChange = (e) => {
    setSaved(false);
    setFarmer(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveToCloud = async () => {
    if (!farmer.name || !farmer.phone || !farmer.crop || !farmLocation) {
      alert("Please fill name, phone, crop and pick the location on the map.");
      return;
    }
    try {
      const payload = {
        farmer,
        landRecord,
        location: { lat: farmLocation.lat, lng: farmLocation.lng },
        boundarySource: landRecord.surveyNo ? "mp_bhulekh_khasra" : "bhuvan_village",
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

  // choose WMS layers for currently selected state
  const wmsForState = getWmsForState(landRecord.state);

  return (
    <div className="container">
      <h1>Transcedental Farmers • अतींद्रिय किसान</h1>
      <p style={{ marginTop: -10, color: "#555" }}>Fill details, pick state (Madhya Pradesh) and mark farm</p>

      <div className="card">
        <h2>Farmer Details</h2>
        <div className="grid">
          <label>Name <input name="name" value={farmer.name} onChange={onChange} /></label>
          <label>Phone <input name="phone" value={farmer.phone} onChange={onChange} /></label>
          <label>Village <input name="village" value={farmer.village} onChange={onChange} /></label>
          <label>Crop <input name="crop" value={farmer.crop} onChange={onChange} /></label>
          <label>Stage
            <select name="cropStage" value={farmer.cropStage} onChange={onChange}>
              <option value="">Select…</option>
              <option value="sowing">Sowing</option>
              <option value="vegetative">Vegetative</option>
              <option value="flowering">Flowering</option>
              <option value="grain">Grain</option>
              <option value="harvest">Harvest</option>
            </select>
          </label>
        </div>
      </div>

      {/* Land record (state selection matters) */}
      <div className="card">
        <h2>Land Record / State selection</h2>
        <div className="grid">
          <label>State
            <select name="state" value={landRecord.state} onChange={(e) => setLandRecord(prev => ({ ...prev, state: e.target.value }))}>
              <option>Madhya Pradesh</option>
              <option>Maharashtra</option>
              <option>Chhattisgarh</option>
              <option>All India (Bhuvan)</option>
            </select>
          </label>
          <label>District <input name="district" value={landRecord.district} onChange={(e) => setLandRecord(prev => ({ ...prev, district: e.target.value }))} /></label>
          <label>Tehsil <input name="tehsil" value={landRecord.tehsil} onChange={(e) => setLandRecord(prev => ({ ...prev, tehsil: e.target.value }))} /></label>
          <label>Village <input name="village" value={landRecord.village} onChange={(e) => setLandRecord(prev => ({ ...prev, village: e.target.value }))} /></label>
          <label>Survey/Khasra No. <input name="surveyNo" value={landRecord.surveyNo} onChange={(e) => setLandRecord(prev => ({ ...prev, surveyNo: e.target.value }))} /></label>
        </div>
      </div>

      <div className="card">
        <h2>Map (Click on the map to select your farm location.)</h2>
        <MapSelector value={farmLocation} onChange={setFarmLocation} wms={wmsForState} />
      </div>

      <button className="primary" onClick={saveToCloud}>Save Registration (Cloud)</button>
      {saved && <div className="ok">✅ Saved to Firebase Cloud!</div>}
    </div>
  );
}
