const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const profileRoutes = require("./routes/profileRoutes");
const tagsRoutes = require("./routes/tagsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connection successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/v1/auth", authRoutes);
app.use("/v1/article", articleRoutes);
app.use("/v1/profile", profileRoutes);
app.use("/v1/tags", tagsRoutes);

app.get("/", (req, res) => {
  res.json({ status: "success", message: "Medium API" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Node server started on ${PORT}`);
});
