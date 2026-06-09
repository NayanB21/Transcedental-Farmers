require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const farmRoutes =
 require("./routes/farmRoutes");
const userRoutes =
  require("./routes/userRoutes");
const analyticsRoutes =
  require("./routes/analyticsRoutes");



const {
  initializeEE
} = require(
  "./services/earthEngineService"
);


const app = express();

//the main/only 2 Middlewares 
app.use(cors());
app.use(express.json());


app.use(
 "/api/users",
 userRoutes
);

app.use("/api/farms",farmRoutes);



app.use(
 "/api/analytics",
 analyticsRoutes
);




mongoose
.connect(
  process.env.MONGO_URI
)
.then(async () => {

  console.log(
    "MongoDB Connected"
  );

  await initializeEE();

  app.listen(

    process.env.PORT,

    () => {

      console.log(
        "Server Running"
      );

    }

  );

})
.catch(err => {

  console.error(err);

});