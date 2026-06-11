// src/App.js
import React, { useState } from "react";




import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FarmRegistration from "./pages/FarmRegistration";
import MyFarms from "./pages/MyFarms";
import FarmDetails from "./pages/FarmDetails";
import YieldAnalytics from "./pages/YieldAnalytics";

import "./App.css";

/**
 * Helper: returns an array (or single object) of WMS configs for a given state key.
 * For Madhya Pradesh we provide a candidate MP WebGIS WMS base URL (you'll fetch exact layer name next).
 * Fallback: Bhuvan (village/admin) WMS for pan-India coverage.
 * ------------this commenting was of previous logic of integrating all open street,mp bhulekh and bhuvan
 */




export default function App() {  //default=main thing/file/fn
  const [page, setPage] =    //useState,useEffect for dashboard
    useState("dashboard");

  const [selectedFarm,setSelectedFarm] =
    useState(null);

  const [user, setUser] =    //useState,useEffect for login and signup
    useState(                //useState,useEffect for FarmRegi is define inside it only
                                  //and not needed here thus not included
    JSON.parse(
      localStorage.getItem("user")
    ) || null
    );


  
  if (user) {

    if (page === "register") {
      return (
        <FarmRegistration
          user={user}
          onBack={() =>
            setPage("dashboard")
          }
        />
      );
    }


    if(page==="farmdetails"){
      return(
        <FarmDetails
          farm={selectedFarm}
          onBack={() =>
            setPage(
              "myfarms"
            )
          }
            onYieldAnalytics={
              (farm)=>{
                setSelectedFarm(
                  farm
                );
                setPage(
                  "yieldanalytics"
                );
              }
            }
        />
      );
    }

    if(page==="yieldanalytics"){
      return(
        <YieldAnalytics
          farm={selectedFarm}
          onBack={() =>
            setPage(
              "farmdetails"
            )
          }
        />
      );
    }

    if (page === "myfarms") {
      return (
        <MyFarms
          user={user}
          onBack={() =>
            setPage(
              "dashboard"
            )
          }
          onFarmSelect={(farm)=>{
            setSelectedFarm(
              farm
            );
            setPage(
              "farmdetails"
            );
          }}
        />
      );

    }

    return (
      <Dashboard
        user={user}

        onRegisterFarm={() =>
          setPage("register")
        }

        onMyFarms={() =>
          setPage("myfarms")
        }

        onLogout={() => {

          localStorage.removeItem(
            "user"
          );

          setUser(null);

        }}
      />
    );

  }

return (

  <div>
    <Signup />
    <hr />
    <Login
      onLogin={setUser}
    />
  </div>
);

  
}
