import React, { useState } from "react";

import FarmerForm from "../components/FarmerForm";
import CadastralForm from "../components/CadastralForm";
import LocationSearch from "../components/LocationSearch";
import MapSelector from "../components/MapSelector";

const bhuvanWms = {
  url:
    "https://bhuvan-vec1.nrsc.gov.in/bhuvan/gwc/service/wms?",
  layers: "basemap:WB_Vill",
  format: "image/png",
  transparent: true,
  version: "1.1.1",
  opacity: 0.8
};

export default function FarmRegistration({
  user,
  onBack
}) {

  const [farmer, setFarmer] =
    useState({
      name: "",
      phone: "",
      village: "",
      crop: "",
      cropStage: ""
    });

  const [landRecord, setLandRecord] =
    useState({
      state: "West Bengal",
      district: "",
      tehsil: "",
      village: ""
    });

  const [farmLocation, setFarmLocation] =
    useState(null);

  const [farmPolygon, setFarmPolygon] =
    useState([]);

  const [mapCenter, setMapCenter] =
    useState(null);

  const [saved, setSaved] =
    useState(false);

  const saveToCloud = async () => {

    if (
      !farmer.name ||
      !farmer.phone ||
      !farmer.crop ||
      !farmLocation ||
      farmPolygon.length < 3
    ) {
      alert(
        "Fill all fields and draw polygon."
      );
      return;
    }

    try {

      const payload = {

        userId: user._id,

        farmer,
        landRecord,

        location: {
          lat: farmLocation.lat,
          lng: farmLocation.lng
        },

        polygon: farmPolygon,

        boundarySource:
          "farmer_drawn_polygon"
      };

      const response =
        await fetch(
          "http://localhost:5000/api/farms",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(payload)
          }
        );

      if (!response.ok)
        throw new Error(
          "Failed to save"
        );

      setSaved(true);

      alert(
        "Saved to MongoDB"
      );

    } catch (err) {

      alert(err.message);

    }
  };

  return (

    <div className="container">

      <button
        onClick={onBack}
      >
        ← Back To Dashboard
      </button>

      <h1>
        Register New Farm
      </h1>

      <FarmerForm
        value={farmer}
        onChange={setFarmer}
        onEdit={() =>
          setSaved(false)
        }
      />

      <CadastralForm
        value={landRecord}
        onChange={setLandRecord}
        onEdit={() =>
          setSaved(false)
        }
      />

      <LocationSearch
        onLocationFound={(
          location
        ) => {

          setMapCenter(
            location
          );

          setFarmLocation(
            location
          );

        }}
      />

      <div className="card">

        <h2>
          Farm Location
        </h2>

        <MapSelector
          center={mapCenter}
          polygon={farmPolygon}
          onPolygonChange={
            setFarmPolygon
          }
          onSave={saveToCloud}
          saved={saved}
          value={farmLocation}
          onChange={(
            location
          ) => {

            setSaved(false);

            setFarmLocation(
              location
            );

          }}
          wms={bhuvanWms}
        />

      </div>

    </div>

  );

}