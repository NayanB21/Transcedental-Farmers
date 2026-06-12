import React, { useEffect, useState } from "react";

import * as turf from "@turf/turf";

import ReactMarkdown from "react-markdown";

import polygonToGeoJson from "../utils/polygonToGeoJson";

import { MapContainer, TileLayer, Polygon } from "react-leaflet";

import "leaflet/dist/leaflet.css";

export default function FarmDetails({ farm, onBack, onYieldAnalytics }) {
  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([]);

  const [report, setReport] = useState(null);

  const [showHistory, setShowHistory] = useState(false);

  const [listening, setListening] = useState(false);

  const [speechLanguage, setSpeechLanguage] = useState("hi-IN");

  const polygonPositions = farm.polygon.map((point) => [point.lat, point.lng]);

  let areaSqm = 0;

  let areaAcres = 0;

  let areaHectares = 0;

  if (farm.polygon && farm.polygon.length >= 3) {
    const coordinates = farm.polygon.map((p) => [p.lng, p.lat]);
    coordinates.push(coordinates[0]);

    const polygon = turf.polygon([coordinates]);

    const geoJson = polygonToGeoJson(farm.polygon);

    console.log(geoJson);

    areaSqm = turf.area(polygon);

    areaAcres = areaSqm / 4046.86;

    areaHectares = areaSqm / 10000;
  }

  useEffect(() => {
    const geoJson = polygonToGeoJson(farm.polygon);

    fetch("http://localhost:5000/api/analytics/farm", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        farmId: farm._id,
        geoJson,

        crop: farm.farmer.crop,
      }),
    })
      .then((res) => res.json())

      .then((data) => {
        //this data is res.json() only
        //debug step
        console.log("ANALYTICS RESPONSE:", data);

        setReport(data);
      })

      .catch(console.error);

    fetch(`http://localhost:5000/api/chats/${farm._id}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      });
  }, [farm]);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");

      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.lang = speechLanguage;

    setListening(true);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setQuestion(transcript);
    };

    recognition.onerror = (event) => {
      console.error(event);

      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const askAssistant = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/chat",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            farmId: farm._id,

            crop: farm.farmer.crop,

            analytics: report.analytics,

            stresses: report.stresses,

            question,
          }),
        },
      );

      const data = await response.json();

      setAnswer(data.answer);

      setQuestion("");

      const chats = await fetch(`http://localhost:5000/api/chats/${farm._id}`);

      const history = await chats.json();

      setMessages(history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

console.log("REPORT =", report);
console.log("MESSAGES =", messages);
console.log("FARM =", farm);



  return (
    <div className="container">
      <button onClick={onBack}>← Back</button>

      <h1>Farm Details</h1>

      <div className="card">
        <h3>Crop: {farm.farmer.crop}</h3>

        <p>Farmer: {farm.farmer.name}</p>

        <p>Village: {farm.landRecord.village}</p>

        <p>District: {farm.landRecord.district}</p>

        <hr />

        <h3>Area Information</h3>

        <p>Square Meters: {areaSqm.toFixed(2)}</p>

        <p>Acres: {areaAcres.toFixed(2)}</p>

        <p>Hectares: {areaHectares.toFixed(2)}</p>
      </div>

      <div className="card">
        <h2>Farm Boundary</h2>

        <MapContainer
          center={polygonPositions[0]}
          zoom={17}
          style={{
            height: "350px",
            width: "100%",
          }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Esri"
          />

          <TileLayer
            url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            attribution="Esri Labels"
          />

          <Polygon positions={polygonPositions} />
        </MapContainer>
      </div>

      {report && (
        <div className="card">
          <h2>Satellite Analytics</h2>

          <p>NDVI: {report?.analytics?.ndvi?.toFixed(2)}</p>

          <p>NDRE: {report?.analytics?.ndre?.toFixed(2)}</p>

          <p>NDWI: {report?.analytics?.ndwi?.toFixed(2)}</p>

          <p>MSI: {report?.analytics?.msi?.toFixed(2)}</p>
        </div>
      )}

      {report && (
        <div className="card">
          <h3>
            Health Score: {report?.recommendations?.score ?? "--"}
            /100
          </h3>

          <h2>Crop Health Report</h2>

          <p>
            Health: <b>{report?.recommendations?.health}</b>
          </p>

          <p>
            Risk: <b>{report?.recommendations?.risk}</b>
          </p>

          <h3>Recommendations</h3>

          <ul>
            {report?.recommendations?.recommendations?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {report && (
        <div className="card">
          <h2>Stress Detection</h2>

          <ul>
            {report.stresses.map((stress, index) => (
              <li key={index}>{stress}</li>
            ))}
          </ul>
        </div>
      )}

      {report && (
        <div className="card">
          <h2>Crop Specific Advice</h2>

          <ul>
            {report.cropAdvice.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {report && (
        <div className="card">
          <h2>🤖 Farm Assistant</h2>

          <button onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? "Hide Chat History" : "Show Chat History"}
          </button>

          {showHistory && (
            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "10px",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              {messages?.map((msg) => (
                <div
                  key={msg._id}
                  style={{
                    textAlign: msg.role === "user" ? "right" : "left",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "10px",
                      borderRadius: "12px",
                      maxWidth: "70%",
                      background: msg.role === "user" ? "#d1e7ff" : "#f1f1f1",
                    }}
                  >
                    <ReactMarkdown>{msg.message}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}

          <select
            value={speechLanguage}
            onChange={(e) => setSpeechLanguage(e.target.value)}
          >
            <option value="hi-IN">Hindi</option>
            <option value="en-US">English</option>
            <option value="bn-IN">Bengali</option>
          </select>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            style={{
              width: "100%",
            }}
            placeholder="Ask about your crop..."
          />

          <br />

          <button onClick={startListening}>
            {listening ? "🎙️ Listening..." : "🎤 Speak"}
          </button>

          <br />
          <br />
          <button onClick={askAssistant}>Ask Assistant</button>
          {loading && <p>🤖 Analyzing your farm...</p>}
          {answer && (
            <div
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "12px",
              }}
            >
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          )}
        </div>
      )}

      {
        <div className="card">
          <h2>Your Yield Prediction</h2>
          <button className="primary" onClick={() => onYieldAnalytics(farm,report)}>
            View Yield Analytics
          </button>
        </div>
      }
    </div>
  );
}
