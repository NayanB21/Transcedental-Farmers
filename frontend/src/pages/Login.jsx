import React, { useState } from "react";

export default function Login({ onLogin }) {

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const login = async () => {

    try {

      const res =
        await fetch(
          "http://localhost:5000/api/users/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
              "application/json"
            },

            body: JSON.stringify({
              phone,
              password
            })
          }
        );

      const data =
        await res.json();

      if (!res.ok)
        throw new Error(
          data.message
        );

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );

      onLogin(data);

    }
    catch (err) {

      alert(err.message);

    }

  };

  return (

    <div className="card">

      <h2>Login</h2>

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e)=>
          setPhone(
            e.target.value
          )
        }
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>
          setPassword(
            e.target.value
          )
        }
      />

      <br/><br/>

      <button
        className="primary"
        onClick={login}
      >
        Login
      </button>

    </div>

  );

}