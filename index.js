let express = require("express");
let cors = require("cors");
let dotenv = require("dotenv");
let app = express();
dotenv.config();

let PORT = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.DB_URL;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(express.json());
app.use(cors());

app.get("/tab-details", async (req, res) => {
  await client.connect();
  let result = await client
    .db("edufundb")
    .collection("tabcollection")
    .find()
    .toArray();
  if (result) {
    res.send(result);
    await client.close();
  } else {
    res.send(`Failed to fetch`);
  }
});

app.post("/add-toy", async (req, res) => {
  console.log(req.body);
  await client.connect();
  let result = await client
    .db("edufundb")
    .collection("alltoys")
    .insertOne({
      ...req.body,
    });

  if (result) {
    res.send(result);
    console.log(result);
    await client.close();
  } else {
    res.send(`Failed to Save`);
  }
});
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
