// src/components/CadastralForm.jsx
import React from "react";

export default function CadastralForm({ value, onChange }) {
  const handle = (e) => onChange({ ...value, [e.target.name]: e.target.value });

  return (
    <div className="card">
      <h2>Land Record Details / भू-अभिलेख विवरण</h2>
      <div className="grid">
        <label>
          State / राज्य
          <input name="state" value={value.state || ""} onChange={handle} placeholder="e.g., Madhya Pradesh" />
        </label>
        <label>
          District / ज़िला
          <input name="district" value={value.district || ""} onChange={handle} placeholder="e.g., Chhindwara" />
        </label>
        <label>
          Tehsil/Taluk / तहसील
          <input name="tehsil" value={value.tehsil || ""} onChange={handle} placeholder="e.g., Pandhurna" />
        </label>
        <label>
          Village / गाँव
          <input name="village" value={value.village || ""} onChange={handle} placeholder="e.g., Marud" />
        </label>
        <label>
          Khasra/Survey No. / खसरा
          <input name="surveyNo" value={value.surveyNo || ""} onChange={handle} placeholder="e.g., 123/4A" />
        </label>
      </div>
      <p style={{fontSize:13,color:"#666",marginTop:8}}>
        Tip/Advice/Notice/Disclaimer
      </p>
    </div>
  );
}
