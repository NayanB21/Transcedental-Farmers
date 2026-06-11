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
const chatRoutes =
  require("./routes/chatRoutes");
const chatHistoryRoutes =
  require("./routes/chatHistoryRoutes");
const timelineRoutes =
  require("./routes/timelineRoutes");
const yieldRoutes =
  require("./routes/yieldRoutes");
const yieldAnalysisRoutes =
  require("./routes/yieldAnalysisRoutes");
const reportRoutes =
  require("./routes/reportRoutes");

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
 "/api/chat",
 chatRoutes
);

app.use(
 "/api/analytics",
 analyticsRoutes
);

app.use(
 "/api/chats",
 chatHistoryRoutes
);

app.use(
 "/api/timeline",
 timelineRoutes
);

app.use(
 "/api/yield",
 yieldRoutes
);

app.use(
 "/api/yield-analysis",
 yieldAnalysisRoutes
);

app.use(
 "/api/report",
 reportRoutes
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