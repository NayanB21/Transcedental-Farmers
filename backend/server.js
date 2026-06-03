require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const farmRoutes =
 require("./routes/farmRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/farms",farmRoutes);

mongoose
.connect(process.env.MONGO_URI)
.then(()=>{

  console.log("MongoDB Connected");

  app.listen(
    process.env.PORT,
    ()=>{
      console.log(
       "Server Running"
      );
    }
  );

});