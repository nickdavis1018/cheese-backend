require("dotenv").config();
const { PORT = 3000, MONGODB_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");


mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection
  .on("open", () => console.log("You are connected to mongoose"))
  .on("close", () => console.log("You are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Say CHEEEEEEEEEEESE!");
});

app.get("/cheese", async (req, res) => {
  try {
    res.json(await Cheese.find({}));
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/cheese", async (req, res) => {
  try {
    res.json(await Cheese.create(req.body));
  } catch (error) {
    res.status(400).json(error);
  }
});

app.put("/cheese/:id", async (req, res) => {
  try {
    res.json(
      await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json(error);
  }
});

app.delete("/cheese/:id", async (req, res) => {
  try {
    res.json(await Cheese.findByIdAndRemove(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

app.get("/cheese/:id", async (req, res) => {
  try {
    res.json(await Cheese.find(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));