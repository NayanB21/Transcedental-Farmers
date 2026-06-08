import React,
{
 useState
}
from "react";

export default function Signup() {

 const [form,setForm] =
 useState({

  name:"",
  phone:"",
  password:""

 });

 const signup =
 async ()=>{

  const res =
  await fetch(
   "http://localhost:5000/api/users/signup",
   {
    method:"POST",

    headers:{
      "Content-Type":
      "application/json"
    },

    body:
    JSON.stringify(form)
   }
  );

  const data =
  await res.json();

  alert(data.message ||
        "Signup Success");

 };

 return(

  <div className="card">

   <h2>
    Signup
   </h2>

   <input
    placeholder="Name"
    onChange={(e)=>
      setForm({
       ...form,
       name:e.target.value
      })
    }
   />

   <br/><br/>

   <input
    placeholder="Phone"
    onChange={(e)=>
      setForm({
       ...form,
       phone:e.target.value
      })
    }
   />

   <br/><br/>

   <input
    type="password"
    placeholder="Password"
    onChange={(e)=>
      setForm({
       ...form,
       password:e.target.value
      })
    }
   />

   <br/><br/>

   <button
    className="primary"
    onClick={signup}
   >
    Signup
   </button>

  </div>

 );

}