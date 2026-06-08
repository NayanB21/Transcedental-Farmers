import React from "react";

export default function Dashboard({

  user,

  onLogout,

  onRegisterFarm,

  onMyFarms

}) {

  return (

    <div className="container">

      <h1>
        Welcome,
        {" "}
        {user.name}
      </h1>

      <p>
        Phone:
        {" "}
        {user.phone}
      </p>

      <br />

      <button
        className="primary"
        onClick={onRegisterFarm}
      >
        Register New Farm
      </button>

      <br />
      <br />

      <button
        className="primary"
        onClick={onMyFarms}
      >
        My Farms
      </button>

      <br />
      <br />

      <button
        onClick={onLogout}
      >
        Logout
      </button>

    </div>

  );

}