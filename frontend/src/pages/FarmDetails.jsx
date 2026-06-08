import React from "react";
import * as turf from "@turf/turf";
import polygonToGeoJson from "../utils/polygonToGeoJson";

export default function FarmDetails({

  farm,
  onBack

}) {

  let areaSqm = 0;

  let areaAcres = 0;

  let areaHectares = 0;

  if (
    farm.polygon &&
    farm.polygon.length >= 3
  ) {

    const coordinates =
      farm.polygon.map(p => [
        p.lng,
        p.lat
      ]);

    coordinates.push(
      coordinates[0]
    );

    const polygon =
      turf.polygon([
        coordinates
      ]);

    const geoJson =
        polygonToGeoJson(
            farm.polygon
        );

        console.log(
        geoJson
        );

    areaSqm =
      turf.area(
        polygon
      );

    areaAcres =
      areaSqm / 4046.86;

    areaHectares =
      areaSqm / 10000;
  }

  return (

    <div className="container">

      <button
        onClick={onBack}
      >
        ← Back
      </button>

      <h1>
        Farm Details
      </h1>

      <div className="card">

        <h3>
          Crop:
          {" "}
          {farm.farmer.crop}
        </h3>

        <p>
          Farmer:
          {" "}
          {farm.farmer.name}
        </p>

        <p>
          Village:
          {" "}
          {farm.landRecord.village}
        </p>

        <p>
          District:
          {" "}
          {farm.landRecord.district}
        </p>

        <hr />

        <h3>
          Area Information
        </h3>

        <p>
          Square Meters:
          {" "}
          {areaSqm.toFixed(2)}
        </p>

        <p>
          Acres:
          {" "}
          {areaAcres.toFixed(2)}
        </p>

        <p>
          Hectares:
          {" "}
          {areaHectares.toFixed(2)}
        </p>

      </div>

    </div>

  );

}