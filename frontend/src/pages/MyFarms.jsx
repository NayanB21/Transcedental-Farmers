import React, { useEffect, useState } from "react";

export default function MyFarms({ user, onBack, onFarmSelect }) {
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    console.log("USER:", user);
    fetch(`http://localhost:5000/api/farms/user/${user._id}`)
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
          return;
        }
        return res.json();
      })

      .then((data) => {
        console.log("MY FARMS RESPONSE:", data);
        setFarms(data);
      });
  }, [user]);

  return (
    <div className="container">
      <button onClick={onBack}>← Back</button>

      <h1>My Farms</h1>

      {farms.length === 0 ? (
        <p>No farms registered.</p>
      ) : (
        farms.map((farm) => (
          <div
            key={farm._id}
            className="card"
            style={{
              cursor: "pointer",
            }}
            onClick={() => onFarmSelect(farm)}
          >
            <h3>{farm.farmer.crop}</h3>

            <p>Village: {farm.landRecord.village}</p>

            <p>District: {farm.landRecord.district}</p>
          </div>
        ))
      )}
    </div>
  );
}
