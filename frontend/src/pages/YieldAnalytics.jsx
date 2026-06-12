import React, { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";

import polygonToGeoJson from "../utils/polygonToGeoJson";

import HealthChart from "../components/HealthChart";

export default function YieldAnalytics({ farm, report,onBack }) {
  const [timeline, setTimeline] = useState([]);

  const [yieldData, setYieldData] =
  useState(
  report?.yieldData || null
  );

  const [aiAnalysis, setAiAnalysis] =
  useState(
  report?.aiAnalysis || ""
  );

  const downloadReport =
    async()=>{

    const response =
    await fetch(

    "http://localhost:5000/api/report/farm-report",

    {

      method:"POST",

      headers:{
      "Content-Type":
      "application/json"
      },

      body:
      JSON.stringify({

      crop:
      farm.farmer.crop,

      village:
      farm.landRecord.village,

      healthScore:

      timeline.length > 0

      ?

      timeline[
      timeline.length-1
      ].healthScore

      :

      0,

      predictedYield:

      yieldData
      ?.predictedYield || 0,

      analysis:
      aiAnalysis

      })

    }

    );

    const blob =
    await response.blob();

    const url =
    window.URL
    .createObjectURL(
      blob
    );

    const a =
    document.createElement(
    "a"
    );

    a.href =
    url;

    a.download =
    "FarmReport.pdf";

    a.click();

    };



  useEffect(() => {


    const geoJson = polygonToGeoJson(farm.polygon);


    fetch(
      "http://localhost:5000/api/timeline/ndvi",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
           farmId:farm._id,
          geoJson,
        }),
      },
    )
      .then((res) => res.json())
      .then((data) => {
        const enriched = data.map((point) => ({
          ...point,
          ndvi: Number(point.ndvi.toFixed(2)),
          
          date: new Date(point.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),
        }));

        setTimeline(enriched);

        setYieldData(
        report?.yieldData
        );

        setAiAnalysis(
        report?.aiAnalysis
        );

            

          


      }).catch(console.error);

    


  }, [farm]);

  return (
    <div className="container">
      <button onClick={onBack}>← Back</button>

      <h1>Yield Analytics</h1>

      <div className="card">
        <h3>Crop: {farm.farmer.crop}</h3>

        <p>Village: {farm.landRecord.village}</p>
      </div>

      <div className="card">
        <h3>Latest Health Score</h3>
        <h2>
          {report
            ?.recommendations
            ?.score
          }
          /100
        </h2>
      </div>

      {yieldData && (
        <div className="card">
          <h2>Expected Yield</h2>

          <h1>{yieldData.predictedYield} Quintal/Acre</h1>

          <p>Average Yield: {yieldData.avgYield} Quintal/Acre</p>
        </div>
      )}

      <div className="card">
        <h2>Health Score Time-series</h2>
        <HealthChart data={timeline} />
      </div>

      <div className="card">
        <h2>AI Yield Analysis</h2>
        <div
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: "1.8",
          }}
        >
          <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
        </div>
      </div>




      <button

        className="primary"

        onClick={
          downloadReport
        }

      >

        Download PDF Report

      </button>




    </div>
  );
}
