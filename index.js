require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const app = express();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");

const port = process.env.PORT || 9900;
const database = process.env.DATABASE;

//Middlewares
app.use(
  cors({
    credentials: true,
    origin: "*"
  })
);

//Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);

//DB Connection
mongoose.set("strictQuery", true);
mongoose
  .connect(database)
  .then(() => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log(`DB Error: ${err}`);
  });

//MyRoutes

//Starting Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Running");
});

//RENDER KEEP ALIVE
// const keepAlive = async () => {
//   console.log("running keepAlive");
//   const HOST = "localhost:9900"; //!RENDER ADDRESS
//   const ping = await axios.get(`https://${HOST}/`).catch((error) => {
//     console.log(error);
//   });
//   console.log(ping.data);
// };
// setInterval(keepAlive, 1000);
