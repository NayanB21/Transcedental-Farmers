import React,
{
  useEffect,
  useState
}
from "react";

import * as turf from "@turf/turf";

import polygonToGeoJson
from "../utils/polygonToGeoJson";

export default function FarmDetails({

  farm,
  onBack

}) {

  const [
    report,
    setReport
  ] = useState(null);

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
  useEffect(() => {

    const geoJson =
      polygonToGeoJson(
        farm.polygon
      );

    fetch(
      "http://localhost:5000/api/analytics/farm",
      {

        method:"POST",

        headers:{
          "Content-Type":
          "application/json"
        },

        body:
          JSON.stringify({

          geoJson,

          crop:
          farm.farmer.crop

          })

      }
    )

    .then(
      res => res.json()
    )

    .then(
      data => {   //this data is res.json() only

        setReport(data);

      }
    )

    .catch(
      console.error
    );

  }, [farm]);

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

      {
        report && (

          <div className="card">

            <h2>
              Satellite Analytics
            </h2>

            <p>
              NDVI:
              {" "}
              {
                report.analytics.ndvi?.toFixed(2)
              }
            </p>

            <p>
              NDRE:
              {" "}
              {
                report.analytics.ndre?.toFixed(2)
              }
            </p>

            <p>
              NDWI:
              {" "}
              {
                report.analytics.ndwi?.toFixed(2)
              }
            </p>

            <p>
              MSI:
              {" "}
              {
                report.analytics.msi?.toFixed(2)
              }
            </p>

          </div>

        )
      }

      {
        report && (

          <div className="card">

            <h3>
              Health Score:
              {" "}
              {
              report
              .recommendations
              .score
              }
              /100
            </h3>

            <h2>
              Crop Health Report
            </h2>

            <p>

              Health:
              {" "}
              <b>

              {
                report
                .recommendations
                .health
              }

              </b>

            </p>

            <p>

              Risk:
              {" "}
              <b>

              {
                report
                .recommendations
                .risk
              }

              </b>

            </p>

            <h3>
              Recommendations
            </h3>

            <ul>

            {
              report
              .recommendations
              .recommendations
              .map(

                (
                  item,
                  index
                ) => (

                  <li
                    key={index}
                  >
                    {item}
                  </li>

                )

              )
            }

            </ul>

          </div>

        )
      }


      {
        report && (

          <div className="card">

          <h2>
            Stress Detection
          </h2>

          <ul>

          {
            report.stresses.map(

            (
              stress,
              index
            ) => (

              <li
              key={index}
              >
              {stress}
              </li>

            )

            )
          }

          </ul>

          </div>

        )
      }

      {
        report && (

          <div className="card">

          <h2>
            Crop Specific Advice
          </h2>

          <ul>

          {
            report.cropAdvice.map(

            (
              item,
              index
            ) => (

              <li
              key={index}
              >
              {item}
              </li>

            )

            )
          }

          </ul>

          </div>

        )
        }



    </div>

  );

}