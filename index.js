const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

//Connect Database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x2jda.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Connect database function

async function run() {
  try {
    await client.connect();
    const database = client.db("carMachanic");
    const serviceCollection = database.collection("service");

    //Post API

    app.post("/services", async (req, res) => {
      const service = req.body;

      const result = await serviceCollection.insertOne(service);
      res.json(result);
    });

    //Get API

    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //Get Single API

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello genisu Car Server");
});

app.get("/hello", (req, res) => {
  res.send("Hello page");
});

app.listen(port, () => {
  console.log("Starting Port", port);
});
